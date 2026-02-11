package models

import "time"

type MappackTrack struct {
	MappackID            string                 `gorm:"primaryKey" json:"mappack_id"`
	TrackID              string                 `gorm:"primaryKey" json:"track_id"`
	Track                Track                  `json:"track" gorm:"foreignKey:TrackID"`
	TimeGoalMappackTrack []TimeGoalMappackTrack `gorm:"foreignKey:MappackID,TrackID;references:MappackID,TrackID" json:"timeGoalMappackTrack"`
	CreatedAt            time.Time
	TierID               *int         `json:"tier_id"`
	Tier                 *MappackTier `gorm:"foreignKey:TierID;references:ID" json:"tier"`
	MapStyle             *string      `json:"mapStyle"`
	PersonalBest         int          `gorm:"-" json:"personal_best,omitempty"`
}
