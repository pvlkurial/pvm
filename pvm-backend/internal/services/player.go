package services

import (
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/repositories"
)

type PlayerService interface {
	Create(player *models.Player) error
	GetAll(players *[]models.Player) ([]models.Player, error)
	GetById(id string) (models.Player, error)
	Update(player *models.Player) error
	GetPlayerInfoInMappackTrack(playerId string, mappackId string, trackId string) (models.PlayerMappackTrack, error)
	GetPlayerInfoInMappackTrackAll(playerId string, mappackId string, trackId string) ([]models.PlayerMappackTrack, error)
	UpdatePlayersDisplayNames(players *[]models.Player) error
}

type playerService struct {
	playerRepository repositories.PlayerRepository
}

func NewPlayerService(repo repositories.PlayerRepository) PlayerService {
	return &playerService{playerRepository: repo}
}

func (t *playerService) Create(player *models.Player) error {
	return t.playerRepository.Create(player)
}
func (t *playerService) GetAll(players *[]models.Player) ([]models.Player, error) {
	return t.playerRepository.GetAll()
}

func (t *playerService) GetById(id string) (models.Player, error) {
	return t.playerRepository.GetById(id)
}

func (t *playerService) Update(player *models.Player) error {
	return t.playerRepository.Update(player)
}

func (t *playerService) GetPlayerInfoInMappackTrack(playerId string, mappackId string, trackId string) (models.PlayerMappackTrack, error) {
	return t.playerRepository.GetPlayerInfoInMappackTrack(playerId, mappackId, trackId)
}

func (t *playerService) GetPlayerInfoInMappackTrackAll(playerId string, mappackId string, trackId string) ([]models.PlayerMappackTrack, error) {
	return t.playerRepository.GetPlayerInfoInMappackTrackAll(playerId, mappackId, trackId)
}

func (t *playerService) UpdatePlayersDisplayNames(players *[]models.Player) error {
	return t.playerRepository.UpdatePlayersDisplayNames(players)
}
