package database

import (
	"example/pvm-backend/internal/database/seeds"
	"example/pvm-backend/internal/models"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	DB *gorm.DB
}

func ConnectDatabase() *gorm.DB {
	godotenv.Load(".env")
	dsn := os.Getenv("CONNECTION_STRING")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database.")
	}
	return db
}

func MigrateDatabase(db *gorm.DB) {
	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.MappackTier{})
	db.AutoMigrate(&models.MappackRank{})
	db.AutoMigrate(&models.MapStyle{})
	db.AutoMigrate(&models.Player{})
	db.AutoMigrate(&models.Mappack{})
	db.AutoMigrate(&models.Track{})
	db.AutoMigrate(&models.Record{})
	db.AutoMigrate(&models.MappackTrack{})
	db.AutoMigrate(&models.TimeGoal{})
	db.AutoMigrate(&models.TimeGoalMappackTrack{})
	db.AutoMigrate(&models.PlayerTimeGoalAchievement{})
	db.AutoMigrate(&models.MappackLeaderboardEntry{})
	db.AutoMigrate(&models.MappackPermission{})

	promoteInitialSuperAdmin(db)
}

// promoteInitialSuperAdmin bootstraps the superadmin role by promoting the
// pre-existing admins the first time the role is introduced. Guarded on there
// being no superadmin yet, so later admins are not promoted automatically.
func promoteInitialSuperAdmin(db *gorm.DB) {
	var superAdmins int64
	if err := db.Model(&models.User{}).Where("role = ?", models.RoleSuperAdmin).Count(&superAdmins).Error; err != nil {
		log.Printf("failed to count superadmins: %v", err)
		return
	}
	if superAdmins > 0 {
		return
	}

	result := db.Model(&models.User{}).Where("role = ?", models.RoleAdmin).Update("role", models.RoleSuperAdmin)
	if result.Error != nil {
		log.Printf("failed to promote initial superadmin: %v", result.Error)
		return
	}
	if result.RowsAffected > 0 {
		log.Printf("promoted %d existing admin(s) to superadmin", result.RowsAffected)
	}
}

func SeedDatabase(db *gorm.DB) {
	seeders := seeds.NewSeeders(db)
	seeders.SeedAll()
}
