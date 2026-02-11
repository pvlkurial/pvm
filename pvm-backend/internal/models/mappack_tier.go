package models

type MappackTier struct {
	ID        int    `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string `json:"name"`
	MappackID string `json:"mappack_id"`
	Points    int    `json:"points"`
	Color     string `json:"color"`
}
