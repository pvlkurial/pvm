package models

import "time"

// Time Goal Type: Alien Time, Bronze Time, etc...
type TimeGoal struct {
	ID         int    `gorm:"primaryKey;autoIncrement" json:"id"`
	Name       string `json:"name"`
	MappackID  string `json:"mappack_id"`
	Multiplier int    `json:"multiplier"`
	UpdatedAt  time.Time
}
