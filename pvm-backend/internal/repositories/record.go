package repositories

import (
	"example/pvm-backend/internal/models"

	"gorm.io/gorm"
)

type RecordRepository interface {
	Create(record *models.Record) error
	GetById(id string) (models.Record, error)
	GetByTrackId(id string) ([]models.Record, error)
	GetPlayersRecordsForTrack(trackId string, playerId string) ([]models.Record, error)
	GetTrackTimeGoalsTimes(mappackId string, trackId string) ([]models.TimeGoalMappackTrack, error)
	GetPlayerBestScore(playerID, trackID string) (int, error)
}

type recordRepository struct {
	DB *gorm.DB
}

func NewRecordRepository(db *gorm.DB) RecordRepository {
	return &recordRepository{DB: db}
}

func (t *recordRepository) Create(record *models.Record) error {
	return t.DB.Save(&record).Error
}

func (t *recordRepository) GetById(id string) (models.Record, error) {
	record := models.Record{}
	err := t.DB.First(&record).Where("ID = ?", id).Error
	return record, err
}

func (t *recordRepository) GetByTrackId(id string) ([]models.Record, error) {
	records := []models.Record{}
	subQuery := t.DB.Table("records").
		Select("player_id, MAX(updated_at) as max_time").
		Where("track_id = ?", id).
		Group("player_id")

	err := t.DB.
		Preload("Player").
		Joins("INNER JOIN (?) as latest ON records.player_id = latest.player_id AND records.updated_at = latest.max_time", subQuery).
		Where("records.track_id = ?", id).
		Find(&records).Error

	return records, err
}

func (t *recordRepository) GetPlayersRecordsForTrack(trackId string, playerId string) ([]models.Record, error) {
	records := []models.Record{}
	err := t.DB.Where("track_id = ?", trackId).Where("player_id = ?", playerId).Find(&records).Error
	return records, err
}

func (t *recordRepository) GetTrackTimeGoalsTimes(mappackId string, trackId string) ([]models.TimeGoalMappackTrack, error) {
	var timeGoals []models.TimeGoalMappackTrack
	err := t.DB.Preload("TimeGoal").Where("mappack_id = ? AND track_id = ?", mappackId, trackId).Find(&timeGoals).Error
	return timeGoals, err
}

func (r *recordRepository) GetPlayerBestScore(playerID, trackID string) (int, error) {
	var bestScore *int
	err := r.DB.Model(&models.Record{}).
		Where("player_id = ? AND track_id = ?", playerID, trackID).
		Select("MIN(record_time)").
		Scan(&bestScore).Error

	if err != nil {
		return 0, err
	}

	// If no record was found, bestScore will be 0
	if bestScore == nil {
		return 0, gorm.ErrRecordNotFound
	}

	return *bestScore, nil
}
