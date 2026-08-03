package models

import "time"

// MappackPermission grants an admin full management rights over a single mappack.
// Superadmins manage every mappack and never need a grant; plain users cannot hold one.
type MappackPermission struct {
	UserID    string    `gorm:"primaryKey" json:"user_id"`
	MappackID string    `gorm:"primaryKey" json:"mappack_id"`
	GrantedBy string    `json:"granted_by"`
	CreatedAt time.Time `json:"created_at"`

	User    *User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Mappack *Mappack `gorm:"foreignKey:MappackID" json:"mappack,omitempty"`
}
