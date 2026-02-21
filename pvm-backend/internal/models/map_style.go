package models

import "time"

type MapStyle struct {
	Name      string `gorm:"primaryKey" json:"name"`
	ImageURL  string `json:"image_url"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
