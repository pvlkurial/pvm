package services

import (
	"errors"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/models/dtos"
	"example/pvm-backend/internal/repositories"

	"gorm.io/gorm"
)

var ErrPlayerNotFound = errors.New("player not found")

type PlayerProfileService interface {
	GetProfile(playerID string) (dtos.PlayerProfile, error)
	GetRecentAchievements(playerID string, limit, offset int) ([]dtos.RecentAchievement, error)
}

type playerProfileService struct {
	playerRepo      repositories.PlayerRepository
	achievementRepo repositories.AchievementRepository
	mappackRepo     repositories.MappackRepository
}

func NewPlayerProfileService(playerRepo repositories.PlayerRepository, achievementRepo repositories.AchievementRepository,
	mappackRepo repositories.MappackRepository) PlayerProfileService {
	return &playerProfileService{
		playerRepo:      playerRepo,
		achievementRepo: achievementRepo,
		mappackRepo:     mappackRepo,
	}
}

// GetProfile returns the player with their progress in every mappack they have
// played, each with its ranks so the client can place the player's points.
func (s *playerProfileService) GetProfile(playerID string) (dtos.PlayerProfile, error) {
	player, err := s.playerRepo.GetById(playerID)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return dtos.PlayerProfile{}, ErrPlayerNotFound
	}
	if err != nil {
		return dtos.PlayerProfile{}, err
	}

	progress, err := s.achievementRepo.GetPlayerMappackProgress(playerID)
	if err != nil {
		return dtos.PlayerProfile{}, err
	}
	if progress == nil {
		progress = []dtos.PlayerMappackProgress{}
	}
	if err := s.attachRanks(progress); err != nil {
		return dtos.PlayerProfile{}, err
	}

	return dtos.PlayerProfile{
		Player:   dtos.PlayerSummary{ID: player.ID, Name: player.Name},
		Mappacks: progress,
	}, nil
}

func (s *playerProfileService) attachRanks(progress []dtos.PlayerMappackProgress) error {
	mappackIDs := make([]string, len(progress))
	for i, p := range progress {
		mappackIDs[i] = p.MappackID
	}

	ranks, err := s.mappackRepo.GetRanksByMappackIDs(mappackIDs)
	if err != nil {
		return err
	}

	ranksByMappack := make(map[string][]models.MappackRank, len(progress))
	for _, rank := range ranks {
		ranksByMappack[rank.MappackID] = append(ranksByMappack[rank.MappackID], rank)
	}
	for i := range progress {
		// An empty list rather than null, so the client can always iterate it.
		progress[i].Ranks = append([]models.MappackRank{}, ranksByMappack[progress[i].MappackID]...)
	}
	return nil
}

func (s *playerProfileService) GetRecentAchievements(playerID string, limit, offset int) ([]dtos.RecentAchievement, error) {
	achievements, err := s.achievementRepo.GetRecentAchievements(playerID, limit, offset)
	if achievements == nil {
		achievements = []dtos.RecentAchievement{}
	}
	return achievements, err
}
