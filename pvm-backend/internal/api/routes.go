package api

import (
	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/controllers"
	"example/pvm-backend/internal/middleware"
	"example/pvm-backend/internal/repositories"
	"example/pvm-backend/internal/services"
	"example/pvm-backend/internal/workers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Routes struct {
	*gin.Engine
	DB *gorm.DB
}

func (r *Routes) InitRoutes() {
	nadeoClient := clients.NewNadeoAPIClient()
	trackmaniaClient := clients.NewTrackmaniaAPIClient()
	repositories := repositories.NewRepositories(r.DB)
	services := services.NewServices(*repositories, nadeoClient, *trackmaniaClient, r.DB)
	controllers := controllers.NewControllers(*services, nadeoClient)

	workers := workers.NewWorkers(*services, *nadeoClient)
	workers.NadeoWorker.Start()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	auth := r.Group("/auth")
	{
		auth.GET("/login", controllers.AuthController.Login)
		auth.POST("/callback", controllers.AuthController.Callback)
	}

	authorized := r.Group("/")
	authorized.Use(middleware.AuthMiddleware(&services.AuthService))
	{
		authorized.GET("/auth/me", controllers.AuthController.Me)
	}

	adminAccess := r.Group("/")
	adminAccess.Use(middleware.AdminOnly())
	{
		// Tracks (Dev only)
		r.POST("/tracks", controllers.TrackController.Create)
		r.DELETE("/tracks/:track_id")

		// Mappacks
		r.POST("/mappacks", controllers.MappackController.Create)
		r.PUT("/mappacks", controllers.MappackController.Update)

		// Mappack Timegoals
		r.POST("/mappacks/:mappack_id/timegoals", controllers.MappackController.CreateMappackTimeGoal)
		r.PUT("/mappacks/:mappack_id/timegoals", controllers.MappackController.UpdateMappackTimeGoals)

		// Mappack Tracks
		r.POST("/mappacks/:mappack_id/tracks/:track_id", controllers.TrackController.AddTrackToMappack)
		r.DELETE("/mappacks/:mappack_id/tracks/:track_id", controllers.TrackController.RemoveTrackFromMappack)

		// Mappack Track Timegoals (the actual times)
		r.POST("/mappacks/:mappack_id/tracks/:track_id/timegoals", controllers.TrackController.CreateTimeGoalsForTrack)
		r.PATCH("/mappacks/:mappack_id/tracks/:track_id/timegoals", controllers.TrackController.UpdateTimeGoalsForTrack)
		r.DELETE("/mappacks/:mappack_id/timegoals/:id", controllers.MappackController.DeleteTimeGoal)

		// Records
		r.POST("/records", controllers.RecordController.Create)
		r.POST("/tracks/:track_id/records", controllers.RecordController.FetchNewTrackRecords)
		r.POST("/tracks/:track_id/records/:player_id", controllers.RecordController.GetPlayersRecordsForTrack)
		r.POST("/tracks/:track_id/records/:player_id/fetch", controllers.RecordController.FetchPlayersRecordsForTrack)
		// Achievements
		r.POST("/mappacks/:mappack_id/recalculate-achievements", controllers.AchievementController.RecalculateMappackAchievements)

		// Tiers and Ranks
		r.DELETE("/mappacks/:mappack_id/tiers/:id", controllers.MappackController.DeleteTier)
		r.DELETE("/mappacks/:mappack_id/ranks/:id", controllers.MappackController.DeleteRank)

		// Players (Dev only)
		r.POST("/players", controllers.PlayerController.Create)
	}

	r.GET("/tracks/:track_id", controllers.TrackController.GetById)

	r.GET("/players", controllers.PlayerController.GetAll)

	r.GET("/mappacks/:mappack_id/timegoals", controllers.MappackController.GetAllMappackTimeGoals)
	//r.DELETE("/mappacks/:mappack_id/timegoals/:timegoal_id", controllers.MappackController.RemoveTimeGoalFromMappack)

	r.GET("/mappacks", controllers.MappackController.GetAll)
	r.GET("/mappacks/:mappack_id", controllers.MappackController.GetById)

	r.GET("/mappacks/:mappack_id/tracks", controllers.TrackController.GetByMappackId)

	r.GET("/mappacks/:mappack_id/tracks/:track_id/timegoals", controllers.TrackController.GetTimeGoalsForTrack)

	r.GET("/tracks/:track_id/records", controllers.RecordController.GetByTrackId)

	r.GET("mappacks/:mappack_id/tracks/:track_id", controllers.RecordController.GetTrackWithRecords)

	r.GET("/mappacks/:mappack_id/leaderboard", controllers.AchievementController.GetMappackLeaderboard)
	r.GET("/mappacks/:mappack_id/players/:player_id/achievements", controllers.AchievementController.GetPlayerAchievements)
	r.GET("/mappacks/:mappack_id/players/:player_id/rank", controllers.AchievementController.GetPlayerRank)
	r.GET("/mappacks/:mappack_id/players/:player_id/leaderboard-entry", controllers.AchievementController.GetPlayerLeaderboardEntry)

	r.Run("localhost:8080")
}
