package repositories

import (
	"example/pvm-backend/internal/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type PlayerRepository interface {
	Create(player *models.Player) error
	GetAll() ([]models.Player, error)
	GetById(id string) (models.Player, error)
	Update(player *models.Player) error
	GetPlayerInfoInMappackTrack(playerId string, mappackId string, trackId string) (models.PlayerMappackTrack, error)
	GetPlayerInfoInMappackTrackAll(playerId string, mappackId string, trackId string) ([]models.PlayerMappackTrack, error)
	UpdatePlayersDisplayNames(players *[]models.Player) error
}

type playerRepository struct {
	db *gorm.DB
}

func NewPlayerRepository(db *gorm.DB) PlayerRepository {
	return &playerRepository{db: db}
}

func (t *playerRepository) Create(player *models.Player) error {
	err := t.db.Create(&player).Error
	return err
}

func (t *playerRepository) GetAll() ([]models.Player, error) {
	players := []models.Player{}
	err := t.db.Find(&players).Error
	return players, err
}

func (t *playerRepository) GetById(id string) (models.Player, error) {
	player := models.Player{}
	err := t.db.Where("ID = ?", id).First(&player).Error
	return player, err
}

func (t *playerRepository) Update(player *models.Player) error {
	err := t.db.Save(player).Error
	return err
}

func (t *playerRepository) GetPlayerInfoInMappackTrack(playerId string, mappackId string, trackId string) (models.PlayerMappackTrack, error) {
	playerMappackTrack := models.PlayerMappackTrack{}
	err := t.db.Where("player_id = ? AND mappack_id = ? AND track_id = ?", playerId, mappackId, trackId).First(&playerMappackTrack).Error
	return playerMappackTrack, err
}

func (t *playerRepository) GetPlayerInfoInMappackTrackAll(playerId string, mappackId string, trackId string) ([]models.PlayerMappackTrack, error) {
	playerMappackTracks := []models.PlayerMappackTrack{}
	err := t.db.Where("player_id = ? AND mappack_id = ? AND track_id = ?", playerId, mappackId, trackId).Find(&playerMappackTracks).Error
	return playerMappackTracks, err
}

func (t *playerRepository) UpdatePlayersDisplayNames(players *[]models.Player) error {
	return t.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns([]string{"name"}),
	}).Create(players).Error
}
