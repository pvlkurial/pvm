package services

import (
	"errors"
	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/repositories"
	"example/pvm-backend/internal/utils"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type TrackService interface {
	Create(track *models.Track) error
	GetById(id string) (models.Track, error)
	GetAll() ([]models.Track, error)
	GetByMappackId(id string) ([]models.Track, error)
	AddTrackToMappack(trackId string, mappackId string, tmxId string) error
	RemoveTrackFromMappack(trackId string, mappackId string) error
	CreateTimeGoalsForTrack(timegoals *[]models.TimeGoalMappackTrack) error
	GetTimeGoalsForTrack(trackId string, mappackId string) ([]models.TimeGoalMappackTrack, error)
	UpdateTimeGoalsForTrack(timegoals *[]models.TimeGoalMappackTrack) error
	GetByUID(uid string) (models.Track, error)
	SavePlayerMappackTrack(mappackId string, trackId string, playerId string, achievedTime int) error
}

type trackService struct {
	trackRepository repositories.TrackRepository
	client          *clients.NadeoAPIClient
}

func NewTrackService(repo repositories.TrackRepository, client *clients.NadeoAPIClient) TrackService {
	return &trackService{trackRepository: repo, client: client}
}

func (t *trackService) Create(track *models.Track) error {
	return t.trackRepository.Create(track)
}

func (t *trackService) GetById(id string) (models.Track, error) {
	return t.trackRepository.GetById(id)
}

func (t *trackService) GetAll() ([]models.Track, error) {
	return t.trackRepository.GetAll()
}

func (t *trackService) GetByMappackId(id string) ([]models.Track, error) {
	return t.trackRepository.GetByMappackId(id)
}

func (t *trackService) AddTrackToMappack(trackId string, mappackId string, tmxId string) error {
	_, err := t.trackRepository.GetById(trackId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			track := t.client.FetchTrackInfo(trackId)
			if track == nil {
				return fmt.Errorf("fetch track info: %w", err)
			}
			color, err := utils.GetDistinctiveColor(track.ThumbnailURL)
			if err != nil {
				color = "#000000"
			}
			track.DominantColor = color
			track.TmxID = tmxId
			err = t.trackRepository.Create(track)
			if err != nil {
				return fmt.Errorf("create track: %w", err)
			}
		} else {
			return err
		}
	}

	mappackTrack := models.MappackTrack{
		MappackID: mappackId,
		TrackID:   trackId,
		CreatedAt: time.Now(),
	}

	return t.trackRepository.AddTrackToMappack(&mappackTrack)
}

func (t *trackService) RemoveTrackFromMappack(trackId string, mappackId string) error {
	return t.trackRepository.RemoveTrackFromMappack(trackId, mappackId)
}

func (t *trackService) CreateTimeGoalsForTrack(timegoals *[]models.TimeGoalMappackTrack) error {
	return t.trackRepository.CreateTimeGoalsForTrack(timegoals)
}

func (t *trackService) GetTimeGoalsForTrack(trackId string, mappackId string) ([]models.TimeGoalMappackTrack, error) {
	return t.trackRepository.GetTimeGoalsForTrack(trackId, mappackId)
}

func (t *trackService) UpdateTimeGoalsForTrack(timegoals *[]models.TimeGoalMappackTrack) error {
	return t.trackRepository.UpdateTimeGoalsForTrack(timegoals)
}

func (t *trackService) GetByUID(uid string) (models.Track, error) {
	return t.trackRepository.GetByUID(uid)
}

func (t *trackService) SavePlayerMappackTrack(mappackId string, trackId string, playerId string, achievedTime int) error {
	timegoals, _ := t.GetTimeGoalsForTrack(trackId, mappackId)
	achievedTimeGoal := models.TimeGoalMappackTrack{}
	for i := 0; i < len(timegoals); i++ {
		if achievedTime >= timegoals[i].Time {
			achievedTimeGoal = timegoals[i]
		}
	}
	playerMappackTrack := models.PlayerMappackTrack{
		PlayerID:         playerId,
		MappackID:        mappackId,
		TrackID:          trackId,
		Score:            achievedTime,
		AchievedTimeGoal: achievedTimeGoal,
	}
	return t.trackRepository.SavePlayerMappackTrack(&playerMappackTrack)
}
