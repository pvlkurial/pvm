package services

import (
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/repositories"
	"fmt"
	"log"

	"gorm.io/gorm"
)

type AchievementService struct {
	achievementRepo repositories.AchievementRepository
	trackRepo       repositories.TrackRepository
}

func NewAchievementService(achievementRepo repositories.AchievementRepository, trackRepo repositories.TrackRepository) *AchievementService {
	return &AchievementService{
		achievementRepo: achievementRepo,
		trackRepo:       trackRepo,
	}
}

// if anyone reads this, claude is goated for debug
func (s *AchievementService) CheckAndUpdateAchievements(playerID, mappackID, trackID string, playerTime int) error {
	//	log.Printf("=== CheckAndUpdateAchievements ===")
	//	log.Printf("Player: %s, Mappack: %s, Track: %s, Time: %d", playerID, mappackID, trackID, playerTime)

	timeGoals, err := s.trackRepo.GetTrackTimeGoals(mappackID, trackID)
	if err != nil {
		//	log.Printf("ERROR: Failed to get time goals: %v", err)
		return err
	}

	//	log.Printf("Found %d time goals for this track", len(timeGoals))

	if len(timeGoals) == 0 {
		//	log.Printf("WARNING: No time goals found for track %s in mappack %s", trackID, mappackID)
		return s.UpdateMappackLeaderboard(playerID, mappackID)
	}

	for _, tg := range timeGoals {
		//	log.Printf("Checking time goal ID=%d, Name=%s, Required Time=%d, Player Time=%d",
		//	tg.TimegoalID, tg.TimeGoal.Name, tg.Time, playerTime)

		if playerTime <= tg.Time {
			//	log.Printf("✓ Player beat time goal %d!", tg.TimegoalID)

			existing, err := s.achievementRepo.GetAchievement(playerID, mappackID, trackID, tg.TimegoalID)

			if err == gorm.ErrRecordNotFound {
				achievement := &models.PlayerTimeGoalAchievement{
					PlayerID:   playerID,
					MappackID:  mappackID,
					TrackID:    trackID,
					TimeGoalID: tg.TimegoalID,
					PlayerTime: playerTime,
				}

				//log.Printf("Creating new achievement...")
				if err := s.achievementRepo.CreateAchievement(achievement); err != nil {
					//	log.Printf("ERROR creating achievement: %v", err)
					return err
				}

				//log.Printf("✓✓✓ NEW ACHIEVEMENT CREATED! Player %s achieved time goal %d on track %s",
				//	playerID, tg.TimegoalID, trackID)
			} else if err == nil && playerTime < existing.PlayerTime {
				log.Printf("Updating achievement with better time: %d -> %d", existing.PlayerTime, playerTime)
				if err := s.achievementRepo.UpdateAchievementTime(playerID, mappackID, trackID, tg.TimegoalID, playerTime); err != nil {
					log.Printf("ERROR updating achievement time: %v", err)
					return err
				}

				//log.Printf("✓✓✓ IMPROVED ACHIEVEMENT! Player %s improved time goal %d on track %s",
				//	playerID, tg.TimegoalID, trackID)
			} else if err != nil {
				//log.Printf("ERROR checking existing achievement: %v", err)
				return err
			} else {
				//log.Printf("Achievement already exists with same or better time")
			}
		} else {
			//log.Printf("✗ Player did not beat time goal %d (required: %d, player: %d, diff: %d)",
			//	tg.TimegoalID, tg.Time, playerTime, playerTime-tg.Time)
		}
	}

	//log.Printf("Updating leaderboard...")
	return s.UpdateMappackLeaderboard(playerID, mappackID)
}

func (s *AchievementService) UpdateMappackLeaderboard(playerID, mappackID string) error {
	totalPoints, achievementsCount, bestAchievementsCount, err := s.achievementRepo.CalculatePlayerPoints(playerID, mappackID)
	if err != nil {
		return err
	}

	leaderboard := &models.MappackLeaderboardEntry{
		PlayerID:              playerID,
		MappackID:             mappackID,
		TotalPoints:           totalPoints,
		AchievementsCount:     achievementsCount,
		BestAchievementsCount: bestAchievementsCount,
	}

	return s.achievementRepo.UpsertLeaderboardEntry(leaderboard)
}

func (s *AchievementService) GetPlayerAchievements(playerID, mappackID string) ([]models.PlayerTimeGoalAchievement, error) {
	return s.achievementRepo.GetPlayerAchievements(playerID, mappackID)
}

func (s *AchievementService) GetPlayerAchievementsByTrack(playerID, mappackID, trackID string) ([]models.PlayerTimeGoalAchievement, error) {
	return s.achievementRepo.GetPlayerAchievementsByTrack(playerID, mappackID, trackID)
}

func (s *AchievementService) GetMappackLeaderboard(mappackID string, limit int) ([]models.MappackLeaderboardEntry, error) {
	if limit <= 0 || limit > 1000 {
		limit = 100
	}
	return s.achievementRepo.GetLeaderboard(mappackID, limit)
}

func (s *AchievementService) GetPlayerLeaderboardEntry(playerID, mappackID string) (*models.MappackLeaderboardEntry, error) {
	return s.achievementRepo.GetLeaderboardEntry(playerID, mappackID)
}

func (s *AchievementService) GetPlayerRank(playerID, mappackID string) (int, error) {
	return s.achievementRepo.GetPlayerRank(playerID, mappackID)
}

func (s *AchievementService) RecalculateMappackAchievements(mappackID string) error {
	//log.Printf("=== Recalculating achievements for mappack %s ===", mappackID)

	tracks, err := s.trackRepo.GetTracksInMappack(mappackID)
	if err != nil {
		return fmt.Errorf("failed to get tracks: %w", err)
	}

	//log.Printf("Found %d tracks in mappack", len(tracks))

	for _, track := range tracks {
		log.Printf("Processing track: %s", track.TrackID)

		playerBestTimes, err := s.achievementRepo.GetPlayerBestTimesForTrack(track.TrackID)
		if err != nil {
			log.Printf("Error getting best times for track %s: %v", track.TrackID, err)
			continue
		}

		//log.Printf("Found %d players with records on this track", len(playerBestTimes))

		for playerID, bestTime := range playerBestTimes {
			err := s.CheckAndUpdateAchievements(playerID, mappackID, track.TrackID, bestTime)
			if err != nil {
				//log.Printf("Error recalculating for player %s: %v", playerID, err)
			}
		}
	}

	//log.Printf("=== Finished recalculating achievements ===")
	return nil
}

func (s *AchievementService) DeleteMappackAchievements(mappackID string) error {
	return s.achievementRepo.DeleteMappackAchievements(mappackID)
}
