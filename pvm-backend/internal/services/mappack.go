package services

import (
	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/repositories"
	"fmt"
)

type MappackService interface {
	Create(mappack *models.Mappack) error
	GetById(id string) (models.Mappack, error)
	GetAll() ([]models.Mappack, error)
	CreateMappackTimeGoal(timegoal *models.TimeGoal) error
	GetAllMappackTimeGoals(mappackId string) ([]models.TimeGoal, error)
	RemoveTimeGoalFromMappack(id string) (models.TimeGoal, error)
	Update(mappack *models.Mappack) error
	UpdateMappackTimeGoals(timegoals *[]models.TimeGoal) error
	DeleteTimeGoal(id int) error
	DeleteTier(id int) error
	DeleteRank(id int) error
	GetByIdWithAchievements(id string, playerID *string) (*models.Mappack, error)
}

type mappackService struct {
	mappackRepository  repositories.MappackRepository
	playerRepository   repositories.PlayerRepository
	trackmaniaClient   clients.TrackmaniaAPIClient
	achievementService *AchievementService
}

func NewMappackService(repo repositories.MappackRepository, playerRepo repositories.PlayerRepository, tmClient clients.TrackmaniaAPIClient, achievementService *AchievementService) MappackService {
	return &mappackService{
		mappackRepository:  repo,
		playerRepository:   playerRepo,
		trackmaniaClient:   tmClient,
		achievementService: achievementService,
	}
}

func (t *mappackService) Create(mappack *models.Mappack) error {
	return t.mappackRepository.Create(mappack)
}

func (t *mappackService) GetById(id string) (models.Mappack, error) {
	mappack, err := t.mappackRepository.GetById(id)
	if err != nil {
		return models.Mappack{}, err
	}

	nonFoundPlayers := make([]string, 0)
	for _, track := range mappack.MappackTrack {
		foundPlayer, err := t.playerRepository.GetById(track.Track.Author)
		if err != nil {
			fmt.Printf("Player %s not found.\n", track.Track.Author)
			nonFoundPlayers = append(nonFoundPlayers, track.Track.Author)
		} else {
			track.Track.Author = foundPlayer.Name
		}
	}
	// if len(nonFoundPlayers) > 0 {
	// 	players, err := t.trackmaniaClient.FetchPlayerNames(nonFoundPlayers)
	// 	if err != nil {
	// 		return models.Mappack{}, fmt.Errorf("error fetching player names: %w", err)
	// 	}
	// 	if len(players) > 0 {
	// 		err = t.playerRepository.UpdatePlayersDisplayNames(&players)
	// 		if err != nil {
	// 			return models.Mappack{}, fmt.Errorf("error creating players: %w", err)
	// 		}
	// 		fmt.Printf("Created/updated %d players.\n", len(players))
	// 	}
	// }

	return mappack, err
}
func (t *mappackService) GetAll() ([]models.Mappack, error) {
	return t.mappackRepository.GetAll()
}
func (t *mappackService) CreateMappackTimeGoal(timegoal *models.TimeGoal) error {
	return t.mappackRepository.CreateMappackTimeGoal(timegoal)
}
func (t *mappackService) GetAllMappackTimeGoals(mappackId string) ([]models.TimeGoal, error) {
	return t.mappackRepository.GetAllMappackTimeGoals(mappackId)
}
func (t *mappackService) RemoveTimeGoalFromMappack(id string) (models.TimeGoal, error) {
	return t.mappackRepository.RemoveTimeGoalFromMappack(id)
}
func (t *mappackService) Update(mappack *models.Mappack) error {
	return t.mappackRepository.Update(mappack)
}
func (t *mappackService) UpdateMappackTimeGoals(timegoals *[]models.TimeGoal) error {
	return t.mappackRepository.UpdateMappackTimeGoals(timegoals)
}
func (s *mappackService) DeleteTimeGoal(id int) error {
	return s.mappackRepository.DeleteTimeGoal(id)
}

func (s *mappackService) DeleteTier(id int) error {
	return s.mappackRepository.DeleteTier(id)
}

func (s *mappackService) DeleteRank(id int) error {
	return s.mappackRepository.DeleteRank(id)
}

func (s *mappackService) GetByIdWithAchievements(id string, playerID *string) (*models.Mappack, error) {
	mappack, err := s.mappackRepository.GetById(id)
	if err != nil {
		return nil, err
	}

	nonFoundPlayers := make([]string, 0)
	for _, track := range mappack.MappackTrack {
		foundPlayer, err := s.playerRepository.GetById(track.Track.Author)
		if err != nil {
			fmt.Printf("Player %s not found.\n", track.Track.Author)
			nonFoundPlayers = append(nonFoundPlayers, track.Track.Author)
		} else {
			track.Track.Author = foundPlayer.Name
		}
	}

	if playerID != nil && *playerID != "" {
		achievements, err := s.achievementService.GetPlayerAchievements(*playerID, id)
		if err == nil && len(achievements) > 0 {
			// achievement map: trackID -> timeGoalID -> achievement
			achievementMap := make(map[string]map[int]*models.PlayerTimeGoalAchievement)
			for _, ach := range achievements {
				if achievementMap[ach.TrackID] == nil {
					achievementMap[ach.TrackID] = make(map[int]*models.PlayerTimeGoalAchievement)
				}
				achCopy := ach
				achievementMap[ach.TrackID][ach.TimeGoalID] = &achCopy
			}

			for _, track := range mappack.MappackTrack {
				trackAchievements := achievementMap[track.TrackID]
				for j := range track.TimeGoalMappackTrack {
					timeGoal := &track.TimeGoalMappackTrack[j]
					if trackAchievements != nil {
						if ach, exists := trackAchievements[timeGoal.TimegoalID]; exists {
							if ach.PlayerTime <= timeGoal.Time {
								timeGoal.IsAchieved = true
								timeGoal.PlayerTime = &ach.PlayerTime
								track.PersonalBest = ach.PlayerTime
							}
						}
					}
				}
			}
		}
	}

	return &mappack, nil
}
