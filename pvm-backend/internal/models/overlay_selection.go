package models

import "time"

// OverlaySelection is what a user's OBS overlay currently shows. It lets the
// overlay live at one URL per player: picking a map on the site updates this
// row, and the overlay polls it.
type OverlaySelection struct {
	UserID    string `gorm:"primaryKey" json:"player_id"`
	MappackID string `json:"mappack_id"`
	TrackID   string `json:"track_id"`
	// Goal is a time goal's name, or "WR". Stored by name so the choice carries
	// over from map to map within a mappack; empty means the easiest goal.
	Goal      string    `json:"goal"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (OverlaySelection) TableName() string {
	return "overlay_selections"
}
