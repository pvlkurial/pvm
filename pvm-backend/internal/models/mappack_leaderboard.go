package models

import "time"

type MappackLeaderboardEntry struct {
	PlayerID              string    `gorm:"primaryKey" json:"player_id"`
	MappackID             string    `gorm:"primaryKey" json:"mappack_id"`
	TotalPoints           int       `json:"total_points"`
	AchievementsCount     int       `json:"achievements_count"`
	BestAchievementsCount int       `json:"best_achievements_count"`
	LastUpdated           time.Time `json:"last_updated"`

	Player Player `gorm:"foreignKey:PlayerID" json:"player"`
}

func (MappackLeaderboardEntry) TableName() string {
	return "mappack_leaderboard_entries"
}
