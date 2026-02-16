package dtos

import (
	"example/pvm-backend/internal/models"

	"time"
)

type TrackInMappackDto struct {
	ID                       string             `json:"id"`
	MapID                    string             `json:"mapId"`
	MapUID                   string             `json:"mapUid"`
	Name                     string             `json:"name"`
	Author                   string             `json:"author"`
	AuthorName               string             `json:"authorName"`
	Submitter                string             `json:"submitter"`
	AuthorScore              int                `json:"authorScore"`
	GoldScore                int                `json:"goldScore"`
	SilverScore              int                `json:"silverScore"`
	BronzeScore              int                `json:"bronzeScore"`
	CollectionName           string             `json:"collectionName"`
	Filename                 string             `json:"filename"`
	MapType                  string             `json:"mapType"`
	MapStyle                 string             `json:"mapStyle"`
	IsPlayable               bool               `json:"isPlayable"`
	CreatedWithGamepadEditor bool               `json:"createdWithGamepadEditor"`
	CreatedWithSimpleEditor  bool               `json:"createdWithSimpleEditor"`
	Timestamp                time.Time          `json:"timestamp"`
	FileURL                  string             `json:"fileUrl"`
	ThumbnailURL             string             `json:"thumbnailUrl"`
	Time                     int                `json:"time"`
	Tier                     models.MappackTier `json:"tier"`
	DominantColor            string             `json:"dominantColor"`
	UpdatedAt                time.Time          `json:"updatedAt"`
	Records                  []models.Record    `json:"records,omitempty"`
	TimeGoals                []TrackTimeGoalDto `json:"timegoals"`
	PersonalBest             int                `json:"personalBest,omitempty"`
	TmxID                    string             `json:"tmxId"`
}
