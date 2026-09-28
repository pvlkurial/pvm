package dtos

import (
	"example/pvm-backend/internal/models"
	"time"
)

type PlayerSummary struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// PlayerMappackProgress is a player's standing in one mappack they have played.
type PlayerMappackProgress struct {
	MappackID    string `json:"mappack_id"`
	MappackName  string `json:"mappack_name"`
	ThumbnailURL string `json:"thumbnail_url"`
	AccentColor  string `json:"accent_color"`
	MapStyleName string `json:"map_style_name"`
	Type         string `json:"type"`
	TotalPoints  int    `json:"total_points"`
	Rank         int    `json:"rank"`
	// Time goals achieved out of all goals on the tracks the player can see, so
	// hidden tiers only count once they are unlocked.
	AchievedGoals int `json:"achieved_goals"`
	TotalGoals    int `json:"total_goals"`

	Ranks []models.MappackRank `json:"ranks" gorm:"-"`
}

type PlayerProfile struct {
	Player   PlayerSummary           `json:"player"`
	Mappacks []PlayerMappackProgress `json:"mappacks"`
}

// RecentAchievement is one improvement on a track: the best time goal it
// reached, the time that reached it and when.
type RecentAchievement struct {
	MappackID   string    `json:"mappack_id"`
	MappackName string    `json:"mappack_name"`
	TrackID     string    `json:"track_id"`
	TrackName   string    `json:"track_name"`
	GoalName    string    `json:"goal_name"`
	PlayerTime  int       `json:"player_time"`
	AchievedAt  time.Time `json:"achieved_at"`
}
