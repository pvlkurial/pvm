package repositories

import (
	"example/pvm-backend/internal/models"
	"time"

	"gorm.io/gorm"
)

type AchievementRepository interface {
	GetAchievement(playerID, mappackID, trackID string, timeGoalID int) (*models.PlayerTimeGoalAchievement, error)
	CreateAchievement(achievement *models.PlayerTimeGoalAchievement) error
	UpdateAchievementTime(playerID, mappackID, trackID string, timeGoalID int, playerTime int) error
	GetPlayerAchievements(playerID, mappackID string) ([]models.PlayerTimeGoalAchievement, error)
	GetPlayerAchievementsByTrack(playerID, mappackID, trackID string) ([]models.PlayerTimeGoalAchievement, error)

	UpsertLeaderboardEntry(entry *models.MappackLeaderboardEntry) error
	GetLeaderboard(mappackID string, limit, offset int) ([]models.MappackLeaderboardEntry, error)
	GetLeaderboardEntry(playerID, mappackID string) (*models.MappackLeaderboardEntry, error)
	GetPlayerRank(playerID, mappackID string) (int, error)
	CalculatePlayerPoints(playerID, mappackID string) (totalPoints, achievementsCount, bestAchievementsCount int, err error)

	GetPlayerBestTimesForTrack(trackID string) (map[string]int, error)
	DeleteMappackAchievements(mappackID string) error
}

type achievementRepository struct {
	db *gorm.DB
}

func NewAchievementRepository(db *gorm.DB) AchievementRepository {
	return &achievementRepository{db: db}
}

func (r *achievementRepository) GetAchievement(playerID, mappackID, trackID string, timeGoalID int) (*models.PlayerTimeGoalAchievement, error) {
	var achievement models.PlayerTimeGoalAchievement
	err := r.db.Where(
		"player_id = ? AND mappack_id = ? AND track_id = ? AND time_goal_id = ?",
		playerID, mappackID, trackID, timeGoalID,
	).First(&achievement).Error

	if err != nil {
		return nil, err
	}
	return &achievement, nil
}

func (r *achievementRepository) CreateAchievement(achievement *models.PlayerTimeGoalAchievement) error {
	achievement.AchievedAt = time.Now()
	return r.db.Create(achievement).Error
}

func (r *achievementRepository) UpdateAchievementTime(playerID, mappackID, trackID string, timeGoalID int, playerTime int) error {
	return r.db.Model(&models.PlayerTimeGoalAchievement{}).
		Where("player_id = ? AND mappack_id = ? AND track_id = ? AND time_goal_id = ?",
			playerID, mappackID, trackID, timeGoalID).
		Updates(map[string]interface{}{
			"player_time": playerTime,
			"achieved_at": time.Now(),
		}).Error
}

func (r *achievementRepository) GetPlayerAchievements(playerID, mappackID string) ([]models.PlayerTimeGoalAchievement, error) {
	var achievements []models.PlayerTimeGoalAchievement
	err := r.db.
		Preload("TimeGoal").
		Preload("Player").
		Where("player_id = ? AND mappack_id = ?", playerID, mappackID).
		Order("achieved_at DESC").
		Find(&achievements).Error
	return achievements, err
}

func (r *achievementRepository) GetPlayerAchievementsByTrack(playerID, mappackID, trackID string) ([]models.PlayerTimeGoalAchievement, error) {
	var achievements []models.PlayerTimeGoalAchievement
	err := r.db.
		Preload("TimeGoal").
		Where("player_id = ? AND mappack_id = ? AND track_id = ?", playerID, mappackID, trackID).
		Find(&achievements).Error
	return achievements, err
}

func (r *achievementRepository) UpsertLeaderboardEntry(entry *models.MappackLeaderboardEntry) error {
	entry.LastUpdated = time.Now()
	return r.db.Save(entry).Error
}

func (r *achievementRepository) GetLeaderboard(mappackID string, limit, offset int) ([]models.MappackLeaderboardEntry, error) {
	var leaderboard []models.MappackLeaderboardEntry
	err := r.db.
		Preload("Player").
		Where("mappack_id = ?", mappackID).
		Order("total_points DESC, best_achievements_count DESC, last_updated ASC").
		Limit(limit).
		Offset(offset).
		Find(&leaderboard).Error
	return leaderboard, err
}

func (r *achievementRepository) GetLeaderboardEntry(playerID, mappackID string) (*models.MappackLeaderboardEntry, error) {
	var entry models.MappackLeaderboardEntry
	err := r.db.
		Preload("Player").
		Where("player_id = ? AND mappack_id = ?", playerID, mappackID).
		First(&entry).Error

	if err != nil {
		return nil, err
	}
	return &entry, nil
}

func (r *achievementRepository) GetPlayerRank(playerID, mappackID string) (int, error) {
	entry, err := r.GetLeaderboardEntry(playerID, mappackID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return 0, nil
		}
		return 0, err
	}

	var rank int64
	err = r.db.Model(&models.MappackLeaderboardEntry{}).
		Where("mappack_id = ? AND (total_points > ? OR (total_points = ? AND best_achievements_count > ?))",
			mappackID, entry.TotalPoints, entry.TotalPoints, entry.BestAchievementsCount).
		Count(&rank).Error

	return int(rank) + 1, err
}

func (r *achievementRepository) CalculatePlayerPoints(playerID, mappackID string) (totalPoints, achievementsCount, bestAchievementsCount int, err error) {
	type PointsResult struct {
		TotalPoints           int
		AchievementsCount     int
		BestAchievementsCount int
	}

	var result PointsResult

	err = r.db.Raw(`
    SELECT 
        COALESCE(SUM(
            CASE 
                WHEN mt.points IS NOT NULL THEN tg.multiplier * mt.points
                ELSE 0
            END
        ), 0) as total_points,
        COUNT(*) as achievements_count,
        COUNT(DISTINCT pta.track_id) as best_achievements_count
    FROM player_time_goal_achievements pta
    JOIN time_goals tg ON pta.time_goal_id = tg.id
    JOIN mappack_tracks mpt ON pta.track_id = mpt.track_id AND pta.mappack_id = mpt.mappack_id
    LEFT JOIN mappack_tiers mt ON mpt.tier_id = mt.id
    WHERE pta.player_id = ? AND pta.mappack_id = ?
`, playerID, mappackID).Scan(&result).Error

	return result.TotalPoints, result.AchievementsCount, result.BestAchievementsCount, err
}
func (r *achievementRepository) GetPlayerBestTimesForTrack(trackID string) (map[string]int, error) {
	type PlayerBestTime struct {
		PlayerID string
		BestTime int
	}

	var results []PlayerBestTime
	err := r.db.Raw(`
        SELECT 
            player_id,
            MIN(record_time) as best_time
        FROM records
        WHERE track_id = ?
        GROUP BY player_id
    `, trackID).Scan(&results).Error

	if err != nil {
		return nil, err
	}

	playerBestTimes := make(map[string]int)
	for _, result := range results {
		playerBestTimes[result.PlayerID] = result.BestTime
	}

	return playerBestTimes, nil
}

func (r *achievementRepository) DeleteMappackAchievements(mappackID string) error {
	return r.db.Where("mappack_id = ?", mappackID).Delete(&models.PlayerTimeGoalAchievement{}).Error
}
