package models

import "time"

type PlayerTimeGoalAchievement struct {
	PlayerID   string    `gorm:"primaryKey" json:"player_id"`
	MappackID  string    `gorm:"primaryKey" json:"mappack_id"`
	TrackID    string    `gorm:"primaryKey" json:"track_id"`
	TimeGoalID int       `gorm:"primaryKey" json:"time_goal_id"`
	AchievedAt time.Time `json:"achieved_at"`
	PlayerTime int       `json:"player_time"`

	Player   Player   `gorm:"foreignKey:PlayerID" json:"player,omitempty"`
	TimeGoal TimeGoal `gorm:"foreignKey:TimeGoalID" json:"time_goal,omitempty"`
}

func (PlayerTimeGoalAchievement) TableName() string {
	return "player_time_goal_achievements"
}
