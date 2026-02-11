package models

import "time"

type Record struct {
	ID         string    `json:"mapRecordId" gorm:"primaryKey"`
	RecordTime int       `json:"score" gorm:"column:record_time"`
	UpdatedAt  time.Time `json:"updatedAt" gorm:"column:updated_at"`
	PlayerID   string    `json:"accountId" gorm:"type:uuid;column:player_id"`
	TrackID    string    `json:"mapId" gorm:"type:uuid;column:track_id"`
	Player     Player    `json:"player" gorm:"foreignKey:PlayerID"`
	Track      Track     `json:"-" gorm:"foreignKey:TrackID"`
	ZoneID     string    `json:"zoneId" gorm:"column:zone_id"`
	ZoneName   string    `json:"zoneName" gorm:"column:zone_name"`
	Position   int       `json:"position" gorm:"column:position"`
	Timestamp  int64     `json:"timestamp" gorm:"column:timestamp"`
}

type TrackRecordsResponse struct {
	GroupUID string `json:"groupUid"`
	MapUID   string `json:"mapUid"`
	Tops     []struct {
		ZoneID   string   `json:"zoneId"`
		ZoneName string   `json:"zoneName"`
		Top      []Record `json:"top"`
	} `json:"tops"`
}

type RecordScore struct {
	RespawnCount int `json:"respawnCount"`
	Score        int `json:"score"`
	Time         int `json:"time"`
}

type PlayerRecordResponse struct {
	RecordScore RecordScore `json:"recordScore"`
	//Timestamp   string      `json:"timestamp" gorm:"column:timestamp"`
}
