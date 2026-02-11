package models

import "time"

type MapStyle struct {
	Name      string `gorm:"primaryKey" json:"name"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
