package controllers

import (
	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/services"
)

type Controllers struct {
	MappackController     MappackController
	PlayerController      PlayerController
	RecordController      RecordController
	TrackController       TrackController
	AchievementController AchievementController
	AuthController        AuthController
	TmxController         TmxController
}

func NewControllers(services services.Services, client *clients.NadeoAPIClient) *Controllers {
	mappackController := NewMappackController(services.MappackService, &services.AchievementService)
	playerController := NewPlayerController(services.PlayerService)
	recordController := NewRecordController(services.RecordService, services.TracksService, client)
	trackController := NewTrackController(services.TracksService)
	achievementController := NewAchievementController(&services.AchievementService)
	authController := NewAuthController(&services.AuthService)
	tmxController := TmxController{}

	return &Controllers{MappackController: *mappackController, PlayerController: *playerController,
		RecordController: *recordController, TrackController: *trackController, AchievementController: *achievementController, AuthController: *authController, TmxController: tmxController}
}
