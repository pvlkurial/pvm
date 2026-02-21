package seeds

import (
	"example/pvm-backend/internal/models"

	"gorm.io/gorm"
)

type MappackSeeder struct {
	DB *gorm.DB
}

func (m *MappackSeeder) seedMappacks() error {

	mapStyles := []models.MapStyle{
		{Name: "Tech"},
		{Name: "Fullspeed"},
		{Name: "Dirt"},
		{Name: "RPG"},
		{Name: "Mixed"},
		{Name: "Ice"},
		{Name: "Pathfinding"},
		{Name: "LOL"},
	}

	m.DB.Save(mapStyles)
	dbMapStyles := []models.MapStyle{}
	m.DB.Find(&dbMapStyles)
	mappacks := []models.Mappack{}
	return m.DB.Save(mappacks).Error
}
