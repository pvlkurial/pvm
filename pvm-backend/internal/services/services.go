package services

import (
	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/repositories"
	"log"
	"os"

	"gorm.io/gorm"
)

type Services struct {
	MappackService     MappackService
	PlayerService      PlayerService
	RecordService      RecordService
	TracksService      TrackService
	AchievementService AchievementService
	AuthService        AuthService
	PermissionService  PermissionService
	OverlayService     OverlayService
	RecordRefresh      RecordRefreshService
	PlayerProfile      PlayerProfileService
	PatreonService     PatreonService
}

func NewServices(repositories repositories.Repositories, client *clients.NadeoAPIClient, tmClient clients.TrackmaniaAPIClient, patreonClient *clients.PatreonAPIClient, db *gorm.DB) *Services {
	achievementService := NewAchievementService(repositories.AchievementRepository, repositories.TrackRepository)
	mappackService := NewMappackService(repositories.MappackRepository, repositories.PlayerRepository, tmClient, achievementService)
	playerService := NewPlayerService(repositories.PlayerRepository)
	trackService := NewTrackService(repositories.TrackRepository, client)
	recordService := NewRecordService(repositories.RecordRepository,
		repositories.PlayerRepository, repositories.TrackRepository, tmClient, achievementService)
	clientID := os.Getenv("TRACKMANIA_CLIENT_ID")
	clientSecret := os.Getenv("TRACKMANIA_CLIENT_SECRET")
	redirectURI := os.Getenv("TRACKMANIA_REDIRECT_URI")
	// .env names this JWT_SECRET_KEY; the older JWT_SECRET is still accepted.
	jwtSecret := os.Getenv("JWT_SECRET_KEY")
	if jwtSecret == "" {
		jwtSecret = os.Getenv("JWT_SECRET")
	}
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET_KEY is not set: refusing to start, as an empty signing key lets anyone forge a superadmin token")
	}
	authService := NewAuthService(db, clientID, clientSecret, redirectURI, jwtSecret)
	permissionService := NewPermissionService(repositories.PermissionRepository, repositories.MappackRepository, repositories.UserRepository)
	overlayService := NewOverlayService(repositories.OverlayRepository, repositories.TrackRepository)
	recordRefreshService := NewRecordRefreshService(repositories.UserRepository, trackService, recordService, client)
	playerProfileService := NewPlayerProfileService(repositories.PlayerRepository, repositories.AchievementRepository, repositories.MappackRepository)
	patreonService := NewPatreonService(patreonClient, repositories.UserRepository, jwtSecret)

	return &Services{
		MappackService:     mappackService,
		PlayerService:      playerService,
		RecordService:      recordService,
		TracksService:      trackService,
		AchievementService: *achievementService,
		AuthService:        *authService,
		PermissionService:  permissionService,
		OverlayService:     overlayService,
		RecordRefresh:      recordRefreshService,
		PlayerProfile:      playerProfileService,
		PatreonService:     patreonService,
	}
}
