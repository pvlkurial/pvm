package models

import "time"

type Track struct {
	ID                       string    `gorm:"primary_key" json:"id"`
	MapID                    string    `json:"mapId"`
	MapUID                   string    `json:"mapUid"`
	Name                     string    `json:"name"`
	Author                   string    `json:"author"`
	AuthorName               string    `json:"authorName"`
	Submitter                string    `json:"submitter"`
	AuthorScore              int       `json:"authorScore"`
	GoldScore                int       `json:"goldScore"`
	SilverScore              int       `json:"silverScore"`
	BronzeScore              int       `json:"bronzeScore"`
	CollectionName           string    `json:"collectionName"`
	Filename                 string    `json:"filename"`
	MapType                  string    `json:"mapType"`
	MapStyle                 string    `json:"mapStyle"`
	IsPlayable               bool      `json:"isPlayable"`
	CreatedWithGamepadEditor bool      `json:"createdWithGamepadEditor"`
	CreatedWithSimpleEditor  bool      `json:"createdWithSimpleEditor"`
	Timestamp                time.Time `json:"timestamp"`
	FileURL                  string    `json:"fileUrl"`
	ThumbnailURL             string    `json:"thumbnailUrl"`
	WorldRecord              int       `json:"world_record"`
	UpdatedAt                time.Time
	MappackTrack             []*MappackTrack
	DominantColor            string `json:"dominantColor" gorm:"column:dominant_color"`
	TmxID                    string `json:"tmxID" gorm:"column:tmx_id"`
}
