package repositories

import (
	"example/pvm-backend/internal/models"
	"log"
	"reflect"

	"gorm.io/gorm"
)

type TrackRepository interface {
	Create(track *models.Track) error
	GetById(id string) (models.Track, error)
	GetAll() ([]models.Track, error)
	GetByMappackId(id string) ([]models.Track, error)
	AddTrackToMappack(mappackTrack *models.MappackTrack) error
	RemoveTrackFromMappack(trackId string, mappackId string) error
	CreateTimeGoalsForTrack(timegoals *[]models.TimeGoalMappackTrack) error
	GetTimeGoalsForTrack(trackId string, mappackId string) ([]models.TimeGoalMappackTrack, error)
	UpdateTimeGoalsForTrack(timegoals *[]models.TimeGoalMappackTrack) error
	GetTrackInMappackInfo(mappackId string, trackId string) (models.MappackTrack, error)
	GetByUID(uid string) (models.Track, error)
	SavePlayerMappackTrack(playerMappackTrack *models.PlayerMappackTrack) error
	GetMappacksForTrack(trackID string) ([]string, error)
	GetTrackTimeGoals(mappackID, trackID string) ([]models.TimeGoalMappackTrack, error)
	GetTracksInMappack(mappackID string) ([]models.MappackTrack, error)
}

type trackRepository struct {
	db *gorm.DB
}

func NewTrackRepository(db *gorm.DB) TrackRepository {
	return &trackRepository{db: db}
}

func (t *trackRepository) Create(track *models.Track) error {
	return t.db.Save(track).Error
}

func (t *trackRepository) GetById(id string) (models.Track, error) {
	track := models.Track{}
	err := t.db.Where("ID = ?", id).First(&track).Error
	return track, err
}
func (t *trackRepository) GetAll() ([]models.Track, error) {
	var tracks []models.Track
	err := t.db.Find(&tracks).Error
	return tracks, err
}

func (t *trackRepository) GetByMappackId(id string) ([]models.Track, error) {
	tracks := []models.Track{}
	err := t.db.Joins("JOIN mappack_tracks ON mappack_tracks.track_id = tracks.id AND mappack_tracks.mappack_id = ?", id).Find(&tracks).Error
	return tracks, err
}

func (t *trackRepository) AddTrackToMappack(mappackTrack *models.MappackTrack) error {
	return t.db.Create(&mappackTrack).Error
}

func (t *trackRepository) RemoveTrackFromMappack(trackId string, mappackId string) error {
	err := t.db.Where("track_id = ? AND mappack_id = ?", trackId, mappackId).Delete(&models.TimeGoalMappackTrack{}).Error
	if err != nil {
		return err
	}
	return t.db.Where("track_id = ? AND mappack_id = ?", trackId, mappackId).Delete(&models.MappackTrack{}).Error
}

func (t *trackRepository) CreateTimeGoalsForTrack(timegoals *[]models.TimeGoalMappackTrack) error {
	return t.db.Create(timegoals).Error
}

func (t *trackRepository) GetTimeGoalsForTrack(trackId string, mappackId string) ([]models.TimeGoalMappackTrack, error) {
	var timegoals []models.TimeGoalMappackTrack
	err := t.db.Where("track_id = ? AND mappack_id = ?", trackId, mappackId).Find(&timegoals).Error
	return timegoals, err
}

func (t *trackRepository) UpdateTimeGoalsForTrack(timegoals *[]models.TimeGoalMappackTrack) error {
	return t.db.Save(timegoals).Error
}
func (t *trackRepository) GetTrackInMappackInfo(mappackId string, trackId string) (models.MappackTrack, error) {
	mappackTrack := models.MappackTrack{}
	err := t.db.Preload("Tier").Where("mappack_id = ? AND track_id = ?", mappackId, trackId).First(&mappackTrack).Error
	return mappackTrack, err
}

func (t *trackRepository) GetByUID(uid string) (models.Track, error) {
	track := models.Track{}
	err := t.db.Where("map_uid = ?", uid).First(&track).Error
	return track, err
}

func (t *trackRepository) SavePlayerMappackTrack(playerMappackTrack *models.PlayerMappackTrack) error {
	return t.db.Save(playerMappackTrack).Error
}
func (t *trackRepository) GetMappacksForTrack(trackID string) ([]string, error) {
	var mappackIDs []string
	err := t.db.Model(&models.MappackTrack{}).
		Where("track_id = ?", trackID).
		Pluck("mappack_id", &mappackIDs).Error
	return mappackIDs, err
}

func (t *trackRepository) GetTrackTimeGoals(mappackID, trackID string) ([]models.TimeGoalMappackTrack, error) {
	var timeGoals []models.TimeGoalMappackTrack

	// ✅ Add debug logging
	log.Printf("GetTrackTimeGoals called with mappackID=%s, trackID=%s", mappackID, trackID)

	// ✅ Log the table name being used
	tableName := t.db.NamingStrategy.TableName(reflect.TypeOf(models.TimeGoalMappackTrack{}).Name())
	log.Printf("Using table name: %s", tableName)

	err := t.db.
		Preload("TimeGoal").
		Where("mappack_id = ? AND track_id = ?", mappackID, trackID).
		Find(&timeGoals).Error

	// ✅ Log the query result
	log.Printf("Query returned %d time goals, error: %v", len(timeGoals), err)

	if err != nil {
		log.Printf("ERROR in GetTrackTimeGoals: %v", err)
		return nil, err
	}

	// ✅ Log what was found
	for i, tg := range timeGoals {
		log.Printf("  [%d] TimeGoalID=%d, Time=%d", i, tg.TimegoalID, tg.Time)
	}

	return timeGoals, err
}
func (t *trackRepository) GetTracksInMappack(mappackID string) ([]models.MappackTrack, error) {
	var tracks []models.MappackTrack
	err := t.db.Where("mappack_id = ?", mappackID).Find(&tracks).Error
	return tracks, err
}
