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
}

func NewServices(repositories repositories.Repositories, client *clients.NadeoAPIClient, tmClient clients.TrackmaniaAPIClient, db *gorm.DB) *Services {
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
	permissionService := NewPermissionService(repositories.PermissionRepository, repositories.MappackRepository)

	return &Services{
		MappackService:     mappackService,
		PlayerService:      playerService,
		RecordService:      recordService,
		TracksService:      trackService,
		AchievementService: *achievementService,
		AuthService:        *authService,
		PermissionService:  permissionService,
	}
}
