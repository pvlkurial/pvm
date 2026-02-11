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
		{Name: "Trial"},
	}

	m.DB.Save(mapStyles)
	dbMapStyles := []models.MapStyle{}
	m.DB.Find(&dbMapStyles)
	mappacks := []models.Mappack{
		{
			ID:          "mappack-beginner",
			Name:        "Beginner Pack",
			Description: "A collection of beginner-friendly tracks to get you started.",
			MapStyle:    dbMapStyles[0],
		},
		{
			ID:          "mappack-advanced",
			Name:        "Advanced Pack",
			Description: "Challenging tracks for experienced players.",
			MapStyle:    dbMapStyles[1],
		},
		{
			ID:          "mappack-pro",
			Name:        "Pro Pack",
			Description: "The ultimate test for pro players with the toughest tracks.",
			MapStyle:    dbMapStyles[2],
		},
	}
	return m.DB.Save(mappacks).Error
}
