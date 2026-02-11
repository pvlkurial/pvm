package models

type PlayerMappackTrack struct {
	PlayerID         string               `gorm:"primaryKey" json:"playerId"`
	MappackID        string               `gorm:"primaryKey" json:"mappackId"`
	TrackID          string               `gorm:"primaryKey" json:"trackId"`
	Score            int                  `json:"score"`
	AchievedTimeGoal TimeGoalMappackTrack `gorm:"foreignKey:TimeGoalID,MappackID,TrackID;"`
}
