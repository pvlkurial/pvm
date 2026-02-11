package dtos

type TrackTimeGoalDto struct {
	TimeGoalID int    `json:"time_goal_id"`
	Name       string `json:"name"`
	Time       int    `json:"time"`
	IsAchieved bool   `json:"is_achieved"`
	PlayerTime *int   `json:"player_time,omitempty"`
}
