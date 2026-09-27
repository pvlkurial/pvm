package services

import (
	"errors"
	"fmt"
	"time"

	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/repositories"

	"gorm.io/gorm"
)

// ErrOverlayTrackNotInMappack is returned when the chosen track is not part of
// the chosen mappack.
var ErrOverlayTrackNotInMappack = errors.New("track is not in this mappack")

// OverlayUpdate changes part of a selection. Nil fields are left as they are;
// the mappack and track are always set together.
type OverlayUpdate struct {
	MappackID *string
	TrackID   *string
	Goal      *string
}

type OverlayService interface {
	Get(userID string) (models.OverlaySelection, error)
	Update(userID string, update OverlayUpdate) (models.OverlaySelection, error)
}

type overlayService struct {
	overlayRepository repositories.OverlayRepository
	trackRepository   repositories.TrackRepository
}

func NewOverlayService(overlayRepository repositories.OverlayRepository, trackRepository repositories.TrackRepository) OverlayService {
	return &overlayService{overlayRepository: overlayRepository, trackRepository: trackRepository}
}

func (s *overlayService) Get(userID string) (models.OverlaySelection, error) {
	return s.overlayRepository.Get(userID)
}

func (s *overlayService) Update(userID string, update OverlayUpdate) (models.OverlaySelection, error) {
	selection, err := s.overlayRepository.Get(userID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return selection, err
	}
	selection.UserID = userID

	if update.MappackID != nil && update.TrackID != nil {
		if _, err := s.trackRepository.GetTrackInMappackInfo(*update.MappackID, *update.TrackID); err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return selection, ErrOverlayTrackNotInMappack
			}
			return selection, fmt.Errorf("failed to look up track: %w", err)
		}
		selection.MappackID = *update.MappackID
		selection.TrackID = *update.TrackID
	}
	if update.Goal != nil {
		selection.Goal = *update.Goal
	}
	// Set explicitly: GORM only fills UpdatedAt when it is zero, which a loaded
	// row never is.
	selection.UpdatedAt = time.Now()

	if err := s.overlayRepository.Save(&selection); err != nil {
		return selection, err
	}
	return selection, nil
}
