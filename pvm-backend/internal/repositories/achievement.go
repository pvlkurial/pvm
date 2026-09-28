package repositories

import (
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/models/dtos"
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type AchievementRepository interface {
	GetAchievement(playerID, mappackID, trackID string, timeGoalID int) (*models.PlayerTimeGoalAchievement, error)
	CreateAchievement(achievement *models.PlayerTimeGoalAchievement) error
	UpdateAchievementTime(playerID, mappackID, trackID string, timeGoalID int, playerTime int) error
	GetPlayerAchievements(playerID, mappackID string) ([]models.PlayerTimeGoalAchievement, error)
	GetPlayerAchievementsByTrack(playerID, mappackID, trackID string) ([]models.PlayerTimeGoalAchievement, error)
	GetPlayerTrackPositions(playerID string, trackIDs []string) (map[string]int, error)

	UpsertLeaderboardEntry(entry *models.MappackLeaderboardEntry) error
	GetLeaderboard(mappackID string, limit, offset int) ([]models.MappackLeaderboardEntry, error)
	GetLeaderboardEntry(playerID, mappackID string) (*models.MappackLeaderboardEntry, error)
	GetPlayerRank(playerID, mappackID string) (int, error)
	CalculatePlayerPoints(playerID, mappackID string) (totalPoints, achievementsCount, bestAchievementsCount int, err error)

	GetPlayerBestTimesForTrack(trackID string) (map[string]int, error)
	DeleteMappackAchievements(mappackID string) error

	GetPlayerMappackProgress(playerID string) ([]dtos.PlayerMappackProgress, error)
	GetRecentAchievements(playerID string, limit, offset int) ([]dtos.RecentAchievement, error)
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
        COALESCE(SUM(best.best_points), 0) as total_points,
        SUM(best.achievement_count)         as achievements_count,
        COUNT(*)                            as best_achievements_count
    FROM (
        SELECT
            pta.track_id,
            MAX(CASE
                WHEN mt.points IS NOT NULL THEN tg.multiplier * mt.points
                ELSE 0
            END) as best_points,
            COUNT(*) as achievement_count
        FROM player_time_goal_achievements pta
        JOIN time_goals tg ON pta.time_goal_id = tg.id
        JOIN mappack_tracks mpt ON pta.track_id = mpt.track_id AND pta.mappack_id = mpt.mappack_id
        JOIN time_goal_mappack_tracks tgmt ON tgmt.timegoal_id = pta.time_goal_id
            AND tgmt.track_id = pta.track_id
            AND tgmt.mappack_id = pta.mappack_id
        LEFT JOIN mappack_tiers mt ON mpt.tier_id = mt.id
        WHERE pta.player_id = ? AND pta.mappack_id = ?
        AND pta.player_time <= tgmt.time
        GROUP BY pta.track_id
    ) as best
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

func (r *achievementRepository) GetPlayerTrackPositions(playerID string, trackIDs []string) (map[string]int, error) {
	type result struct {
		TrackID  string
		Position int
	}
	var rows []result
	err := r.db.Raw(`
    WITH player_bests AS (
        SELECT DISTINCT ON (track_id, player_id)
            track_id, player_id, record_time AS best_time, updated_at
        FROM records
        WHERE track_id = ANY(?)
        ORDER BY track_id, player_id, record_time ASC, updated_at ASC
    ),
    ranked AS (
        SELECT track_id, player_id,
               RANK() OVER (
                   PARTITION BY track_id
                   ORDER BY best_time ASC, updated_at ASC
               ) AS position
        FROM player_bests
    )
    SELECT track_id, position
    FROM ranked
    WHERE player_id = ?
`, pq.Array(trackIDs), playerID).Scan(&rows).Error

	posMap := make(map[string]int, len(rows))
	for _, r := range rows {
		posMap[r.TrackID] = r.Position
	}
	return posMap, err
}

// GetPlayerMappackProgress returns the player's standing in every active
// mappack they have a leaderboard entry in, highest points first. Goals only
// count when the player's time still beats them, as in CalculatePlayerPoints,
// and tracks in hidden tiers only once the player has the points to see them.
func (r *achievementRepository) GetPlayerMappackProgress(playerID string) ([]dtos.PlayerMappackProgress, error) {
	var progress []dtos.PlayerMappackProgress
	err := r.db.Raw(`
    WITH standings AS (
        SELECT
            player_id,
            mappack_id,
            total_points,
            RANK() OVER (
                PARTITION BY mappack_id
                ORDER BY total_points DESC, best_achievements_count DESC
            ) AS rank
        FROM mappack_leaderboard_entries
    ),
    player_standings AS (
        SELECT * FROM standings WHERE player_id = ?
    ),
    visible_goals AS (
        SELECT tgmt.mappack_id, tgmt.track_id, tgmt.timegoal_id, tgmt.time
        FROM time_goal_mappack_tracks tgmt
        JOIN mappack_tracks mpt ON mpt.mappack_id = tgmt.mappack_id AND mpt.track_id = tgmt.track_id
        JOIN player_standings ps ON ps.mappack_id = tgmt.mappack_id
        LEFT JOIN mappack_tiers mt ON mt.id = mpt.tier_id
        WHERE mt.id IS NULL OR NOT mt.is_hidden OR ps.total_points >= mt.threshold
    )
    SELECT
        m.id               AS mappack_id,
        m.name             AS mappack_name,
        m.thumbnail_url,
        m.accent_color,
        m.map_style_name,
        m."type",
        ps.total_points,
        ps.rank,
        COUNT(pta.time_goal_id) AS achieved_goals,
        COUNT(vg.timegoal_id)   AS total_goals
    FROM player_standings ps
    JOIN mappacks m ON m.id = ps.mappack_id AND m.is_active
    LEFT JOIN visible_goals vg ON vg.mappack_id = ps.mappack_id
    LEFT JOIN player_time_goal_achievements pta
        ON pta.player_id = ps.player_id
        AND pta.mappack_id = vg.mappack_id
        AND pta.track_id = vg.track_id
        AND pta.time_goal_id = vg.timegoal_id
        AND pta.player_time <= vg.time
    GROUP BY m.id, ps.total_points, ps.rank
    ORDER BY ps.total_points DESC, LOWER(m.name) ASC
`, playerID).Scan(&progress).Error
	return progress, err
}

// GetRecentAchievements returns the player's time goal achievements newest
// first, one entry per track: the best goal reached. An improved time moves every
// goal on the track to the new time and date, so that entry is the latest run.
// Visibility follows GetPlayerMappackProgress.
func (r *achievementRepository) GetRecentAchievements(playerID string, limit, offset int) ([]dtos.RecentAchievement, error) {
	var achievements []dtos.RecentAchievement
	err := r.db.Raw(`
    SELECT * FROM (
        SELECT DISTINCT ON (pta.mappack_id, pta.track_id)
            pta.mappack_id,
            m.name       AS mappack_name,
            pta.track_id,
            t.name       AS track_name,
            tg.name      AS goal_name,
            pta.player_time,
            pta.achieved_at
        FROM player_time_goal_achievements pta
        JOIN time_goals tg ON tg.id = pta.time_goal_id
        JOIN time_goal_mappack_tracks tgmt
            ON tgmt.timegoal_id = pta.time_goal_id
            AND tgmt.track_id = pta.track_id
            AND tgmt.mappack_id = pta.mappack_id
        JOIN mappack_tracks mpt ON mpt.mappack_id = pta.mappack_id AND mpt.track_id = pta.track_id
        JOIN mappacks m ON m.id = pta.mappack_id AND m.is_active
        JOIN tracks t ON t.id = pta.track_id
        LEFT JOIN mappack_tiers mt ON mt.id = mpt.tier_id
        LEFT JOIN mappack_leaderboard_entries le
            ON le.player_id = pta.player_id AND le.mappack_id = pta.mappack_id
        WHERE pta.player_id = ?
            AND pta.player_time <= tgmt.time
            AND (mt.id IS NULL OR NOT mt.is_hidden OR COALESCE(le.total_points, 0) >= mt.threshold)
        ORDER BY pta.mappack_id, pta.track_id, tg.multiplier DESC
    ) AS best_per_track
    ORDER BY achieved_at DESC, track_name ASC
    LIMIT ? OFFSET ?
`, playerID, limit, offset).Scan(&achievements).Error
	return achievements, err
}
