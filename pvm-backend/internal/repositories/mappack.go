package repositories

import (
	"example/pvm-backend/internal/models"

	"gorm.io/gorm"
)

type MappackRepository interface {
	Create(mappack *models.Mappack) error
	GetById(id string) (models.Mappack, error)
	GetAll() ([]models.Mappack, error)
	CreateMappackTimeGoal(timegoal *models.TimeGoal) error
	GetAllMappackTimeGoals(mappackId string) ([]models.TimeGoal, error)
	RemoveTimeGoalFromMappack(id string) (models.TimeGoal, error)
	UpdateMappackTimeGoals(timegoals *[]models.TimeGoal) error
	Update(mappack *models.Mappack) error
	DeleteTimeGoalsNotIn(mappackID string, keepIDs []int) error
	DeleteAllTimeGoals(mappackID string) error

	DeleteTiersNotIn(mappackID string, keepIDs []int) error
	DeleteAllTiers(mappackID string) error

	DeleteRanksNotIn(mappackID string, keepIDs []int) error
	DeleteAllRanks(mappackID string) error

	DeleteTimeGoalTracksNotIn(mappackID, trackID string, keepTimeGoalIDs []int) error
	DeleteAllTimeGoalTracks(mappackID, trackID string) error
	DeleteTimeGoal(id int) error
	DeleteTier(id int) error
	DeleteRank(id int) error
}

type mappackRepository struct {
	db *gorm.DB
}

func NewMappackRepository(db *gorm.DB) MappackRepository {
	return &mappackRepository{db: db}
}

func (t *mappackRepository) Create(mappack *models.Mappack) error {
	return t.db.Create(&mappack).Error

}
func (t *mappackRepository) GetById(id string) (models.Mappack, error) {
	mappack := models.Mappack{}
	err := t.db.
		Preload("TimeGoals").
		Preload("MappackTier").
		Preload("MappackRank").
		Preload("MappackTrack.Track").
		Preload("MappackTrack.Tier").
		Preload("MappackTrack.TimeGoalMappackTrack").
		Preload("MappackTrack.TimeGoalMappackTrack.TimeGoal").
		Preload("MapStyle").
		Where("ID = ?", id).
		First(&mappack).Error
	return mappack, err
}

func (t *mappackRepository) GetAll() ([]models.Mappack, error) {
	mappacks := []models.Mappack{}
	err := t.db.Find(&mappacks).Error
	return mappacks, err
}

func (t *mappackRepository) CreateMappackTimeGoal(timegoal *models.TimeGoal) error {
	return t.db.Create(timegoal).Error
}
func (t *mappackRepository) GetAllMappackTimeGoals(mappackId string) ([]models.TimeGoal, error) {
	timegoals := []models.TimeGoal{}
	err := t.db.Where("mappack_id = ?", mappackId).Find(&timegoals).Error
	return timegoals, err
}

func (t *mappackRepository) RemoveTimeGoalFromMappack(id string) (models.TimeGoal, error) {
	timegoals := models.TimeGoal{}
	err := t.db.Where("id = ?", id).Delete(&timegoals).Error
	return timegoals, err
}

func (t *mappackRepository) UpdateMappackTimeGoals(timegoals *[]models.TimeGoal) error {
	for _, timegoal := range *timegoals {
		t.db.Save(&timegoal)
	}
	return nil
}

func (t *mappackRepository) Update(mappack *models.Mappack) error {
	return t.db.Session(&gorm.Session{FullSaveAssociations: true}).Save(mappack).Error
}

func (r *mappackRepository) DeleteTimeGoalsNotIn(mappackID string, keepIDs []int) error {
	if len(keepIDs) > 0 {
		return r.db.Where("mappack_id = ? AND id NOT IN ?", mappackID, keepIDs).Delete(&models.TimeGoal{}).Error
	}
	return nil
}

func (r *mappackRepository) DeleteAllTimeGoals(mappackID string) error {
	return r.db.Where("mappack_id = ?", mappackID).Delete(&models.TimeGoal{}).Error
}

func (r *mappackRepository) DeleteTiersNotIn(mappackID string, keepIDs []int) error {
	if len(keepIDs) > 0 {
		return r.db.Where("mappack_id = ? AND id NOT IN ?", mappackID, keepIDs).Delete(&models.MappackTier{}).Error
	}
	return nil
}

func (r *mappackRepository) DeleteAllTiers(mappackID string) error {
	return r.db.Where("mappack_id = ?", mappackID).Delete(&models.MappackTier{}).Error
}

func (r *mappackRepository) DeleteRanksNotIn(mappackID string, keepIDs []int) error {
	if len(keepIDs) > 0 {
		return r.db.Where("mappack_id = ? AND id NOT IN ?", mappackID, keepIDs).Delete(&models.MappackRank{}).Error
	}
	return nil
}

func (r *mappackRepository) DeleteAllRanks(mappackID string) error {
	return r.db.Where("mappack_id = ?", mappackID).Delete(&models.MappackRank{}).Error
}

func (r *mappackRepository) DeleteTimeGoalTracksNotIn(mappackID, trackID string, keepTimeGoalIDs []int) error {
	if len(keepTimeGoalIDs) > 0 {
		return r.db.Where("mappack_id = ? AND track_id = ? AND time_goal_id NOT IN ?",
			mappackID, trackID, keepTimeGoalIDs).Delete(&models.TimeGoalMappackTrack{}).Error
	}
	return nil
}

func (r *mappackRepository) DeleteAllTimeGoalTracks(mappackID, trackID string) error {
	return r.db.Where("mappack_id = ? AND track_id = ?", mappackID, trackID).Delete(&models.TimeGoalMappackTrack{}).Error
}
func (r *mappackRepository) DeleteTimeGoal(id int) error {
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Table("time_goal_mappack_tracks").Where("timegoal_id = ?", id).Delete(&models.TimeGoalMappackTrack{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Table("player_time_goal_achievements").Where("time_goal_id = ?", id).Delete(&models.PlayerTimeGoalAchievement{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Delete(&models.TimeGoal{}, id).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func (r *mappackRepository) DeleteTier(id int) error {
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Table("mappack_tracks").Where("tier_id = ?", id).Update("tier_id", nil).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Delete(&models.MappackTier{}, id).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func (r *mappackRepository) DeleteRank(id int) error {
	return r.db.Delete(&models.MappackRank{}, id).Error
}
