package models

type Player struct {
	ID      string `gorm:"primaryKey;type:uuid"`
	Name    string `json:"name"`
	Records []*Record
}
