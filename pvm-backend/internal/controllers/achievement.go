// controllers/achievement_controller.go
package controllers

import (
	"example/pvm-backend/internal/services"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AchievementController struct {
	achievementService *services.AchievementService
}

func NewAchievementController(achievementService *services.AchievementService) *AchievementController {
	return &AchievementController{
		achievementService: achievementService,
	}
}

func (c *AchievementController) GetMappackLeaderboard(ctx *gin.Context) {
	mappackID := ctx.Param("mappack_id")

	limit := 100
	if limitParam := ctx.Query("limit"); limitParam != "" {
		if l, err := strconv.Atoi(limitParam); err == nil {
			limit = l
		}
	}

	leaderboard, err := c.achievementService.GetMappackLeaderboard(mappackID, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, leaderboard)
}

func (c *AchievementController) GetPlayerAchievements(ctx *gin.Context) {
	mappackID := ctx.Param("mappack_id")
	playerID := ctx.Param("player_id")

	achievements, err := c.achievementService.GetPlayerAchievements(playerID, mappackID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, achievements)
}

func (c *AchievementController) GetPlayerRank(ctx *gin.Context) {
	mappackID := ctx.Param("mappack_id")
	playerID := ctx.Param("player_id")

	rank, err := c.achievementService.GetPlayerRank(playerID, mappackID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"player_id":  playerID,
		"mappack_id": mappackID,
		"rank":       rank,
	})
}

func (c *AchievementController) GetPlayerLeaderboardEntry(ctx *gin.Context) {
	mappackID := ctx.Param("mappack_id")
	playerID := ctx.Param("player_id")

	entry, err := c.achievementService.GetPlayerLeaderboardEntry(playerID, mappackID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Player not on leaderboard"})
		return
	}

	rank, _ := c.achievementService.GetPlayerRank(playerID, mappackID)

	ctx.JSON(http.StatusOK, gin.H{
		"entry": entry,
		"rank":  rank,
	})
}
func (c *AchievementController) RecalculateMappackAchievements(ctx *gin.Context) {
	mappackID := ctx.Param("mappack_id")

	log.Printf("Starting achievement recalculation for mappack: %s", mappackID)

	// Delete existing achievements first for clean recalculation
	err := c.achievementService.DeleteMappackAchievements(mappackID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old achievements"})
		return
	}

	// Recalculate
	err = c.achievementService.RecalculateMappackAchievements(mappackID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Achievements recalculated successfully"})
}
