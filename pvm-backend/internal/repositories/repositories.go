package repositories

import "gorm.io/gorm"

type Repositories struct {
	MappackRepository     MappackRepository
	PlayerRepository      PlayerRepository
	RecordRepository      RecordRepository
	TrackRepository       TrackRepository
	AchievementRepository AchievementRepository
	PermissionRepository  PermissionRepository
}

func NewRepositories(db *gorm.DB) *Repositories {

	mappackRepository := NewMappackRepository(db)
	playerRepository := NewPlayerRepository(db)
	recordRepository := NewRecordRepository(db)
	trackRepository := NewTrackRepository(db)
	achievementRepository := NewAchievementRepository(db)
	permissionRepository := NewPermissionRepository(db)

	return &Repositories{MappackRepository: mappackRepository, PlayerRepository: playerRepository,
		RecordRepository: recordRepository, TrackRepository: trackRepository, AchievementRepository: achievementRepository,
		PermissionRepository: permissionRepository}
}
