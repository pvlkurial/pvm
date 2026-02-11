package models

import "time"

// the actual time of a timegoal for a track
type TimeGoalMappackTrack struct {
	TrackID    string   `gorm:"primaryKey" json:"track_id"`
	MappackID  string   `gorm:"primaryKey" json:"mappack_id"`
	TimegoalID int      `gorm:"primaryKey" json:"time_goal_id"`
	TimeGoal   TimeGoal `gorm:"foreignKey:TimegoalID;references:ID" json:"timeGoal"`
	Time       int      `json:"time"`
	UpdatedAt  time.Time

	IsAchieved bool `gorm:"-" json:"is_achieved"`
	PlayerTime *int `gorm:"-" json:"player_time,omitempty"`
}
