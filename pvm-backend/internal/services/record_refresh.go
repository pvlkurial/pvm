package services

import (
	"errors"
	"fmt"
	"time"

	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/repositories"

	"gorm.io/gorm"
)

// RecordRefreshCooldown is how often one user may refresh a record, across all
// tracks. Each refresh is a Nadeo API call, so this keeps the site from
// flooding it.
const RecordRefreshCooldown = time.Minute

var (
	ErrRecordRefreshNotAllowed = errors.New("refreshing records is for supporters")
	ErrNoRecordOnTrack         = errors.New("no record found for you on this track")
	ErrRefreshTrackNotFound    = errors.New("no such track")
)

// RecordRefreshCooldownError says how long until the user may refresh again.
type RecordRefreshCooldownError struct {
	RetryAfter time.Duration
}

func (e *RecordRefreshCooldownError) Error() string {
	return fmt.Sprintf("you can refresh again in %d seconds", int(e.RetryAfter.Seconds()+0.5))
}

type RecordRefreshService interface {
	// RefreshOwnRecord pulls the user's own record for a track from Nadeo and
	// saves it. Only the caller's record: never another player's.
	RefreshOwnRecord(user *models.User, trackID string) error
}

type recordRefreshService struct {
	userRepository repositories.UserRepository
	trackService   TrackService
	recordService  RecordService
	nadeoClient    *clients.NadeoAPIClient
}

func NewRecordRefreshService(userRepository repositories.UserRepository, trackService TrackService,
	recordService RecordService, nadeoClient *clients.NadeoAPIClient) RecordRefreshService {
	return &recordRefreshService{
		userRepository: userRepository,
		trackService:   trackService,
		recordService:  recordService,
		nadeoClient:    nadeoClient,
	}
}

func (s *recordRefreshService) RefreshOwnRecord(user *models.User, trackID string) error {
	if !user.CanRefreshRecords() {
		return ErrRecordRefreshNotAllowed
	}

	track, err := s.trackService.GetById(trackID)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return ErrRefreshTrackNotFound
	}
	if err != nil {
		return fmt.Errorf("failed to load track: %w", err)
	}

	// Claimed before calling Nadeo, and kept even if that call fails, so a
	// failing request cannot be retried in a tight loop either.
	claimed, retryAfter, err := s.userRepository.ClaimRecordRefresh(user.ID, RecordRefreshCooldown)
	if err != nil {
		return fmt.Errorf("failed to check refresh cooldown: %w", err)
	}
	if !claimed {
		return &RecordRefreshCooldownError{RetryAfter: retryAfter}
	}

	record, err := s.nadeoClient.FetchRecordsOfTrackForPlayer(track.ID, user.ID, track.MapUID)
	if errors.Is(err, clients.ErrNoPlayerRecord) {
		return ErrNoRecordOnTrack
	}
	if err != nil {
		return fmt.Errorf("failed to fetch record from Nadeo: %w", err)
	}

	record.ID = fmt.Sprintf("%s_%s", track.ID, record.PlayerID)
	record.UpdatedAt = time.Now()
	records := []models.Record{record}
	return s.recordService.SaveFetchedRecords(&records)
}
