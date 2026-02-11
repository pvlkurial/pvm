package models

import "time"

type Mappack struct {
	ID           string `gorm:"primaryKey" json:"id"`
	MappackTrack []*MappackTrack
	Name         string `json:"name"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	IsActive     bool          `json:"isActive"`
	TimeGoals    []*TimeGoal   `gorm:"foreignKey:MappackID" json:"timeGoals"`
	MapStyle     MapStyle      `gorm:"foreignKey:Name" json:"mapStyle"`
	ThumbnailURL string        `json:"thumbnailURL"`
	Description  string        `json:"description"`
	MappackTier  []MappackTier `gorm:"foreignKey:MappackID;references:ID" json:"mappackTiers"`
	MappackRank  []MappackRank `gorm:"foreignKey:MappackID;references:ID" json:"mappackRanks"`
}
