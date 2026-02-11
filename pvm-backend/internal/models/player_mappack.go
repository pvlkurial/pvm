package models

type PlayerMappack struct {
	PlayerID  string `gorm:"primaryKey" json:"playerId"`
	MappackID string `gorm:"primaryKey" json:"mappackId"`
	Score     int    `json:"score"`
}
