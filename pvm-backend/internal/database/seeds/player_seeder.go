package seeds

import (
	"example/pvm-backend/internal/models"

	"gorm.io/gorm"
)

type PlayerSeeder struct {
	DB *gorm.DB
}

func (m *PlayerSeeder) seedPlayers() error {
	players := []models.Player{
		{
			ID:   "d2372a08-a8a1-46cb-97fb-23a161d85ad0",
			Name: "TestPlayer",
		},
	}
	return m.DB.Save(players).Error
}
