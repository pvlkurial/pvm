package repositories

import (
	"example/pvm-backend/internal/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OverlayRepository interface {
	Get(userID string) (models.OverlaySelection, error)
	Save(selection *models.OverlaySelection) error
}

type overlayRepository struct {
	db *gorm.DB
}

func NewOverlayRepository(db *gorm.DB) OverlayRepository {
	return &overlayRepository{db: db}
}

func (r *overlayRepository) Get(userID string) (models.OverlaySelection, error) {
	selection := models.OverlaySelection{}
	err := r.db.Where("user_id = ?", userID).First(&selection).Error
	return selection, err
}

// Save inserts the selection or overwrites the user's existing one.
func (r *overlayRepository) Save(selection *models.OverlaySelection) error {
	return r.db.Clauses(clause.OnConflict{UpdateAll: true}).Create(selection).Error
}
