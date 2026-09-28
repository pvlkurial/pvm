package controllers

import (
	"errors"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/services"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PlayerController struct {
	playerService        services.PlayerService
	playerProfileService services.PlayerProfileService
}

func NewPlayerController(playerService services.PlayerService, playerProfileService services.PlayerProfileService) *PlayerController {
	return &PlayerController{playerService: playerService, playerProfileService: playerProfileService}
}

func (t *PlayerController) Create(c *gin.Context) {
	player := models.Player{}

	err := c.ShouldBind(&player)
	if err != nil {
		fmt.Printf("Error occured while binding Player during creation: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	}

	err = t.playerService.Create(&player)

	if err != nil {
		fmt.Printf("Error occured while creating a Player: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.String(http.StatusOK, "Creation Succesful")
	}

}

func (t *PlayerController) GetAll(c *gin.Context) {
	players := []models.Player{}
	result, err := t.playerService.GetAll(&players)
	if err != nil {
		fmt.Printf("Error occured while getting Players: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, result)
	}
}

func (t *PlayerController) GetById(c *gin.Context) {
	id := c.Param("id")
	result, err := t.playerService.GetById(id)
	if err != nil {
		fmt.Printf("Error occured while getting a Player by id: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, result)
	}
}

func (t *PlayerController) GetPlayerInfoInMappackTrackAll(c *gin.Context) {
	playerId := c.Param("playerId")
	mappackId := c.Param("mappackId")
	trackId := c.Param("trackId")

	result, err := t.playerService.GetPlayerInfoInMappackTrackAll(playerId, mappackId, trackId)
	if err != nil {
		fmt.Printf("Error occured while getting PlayerMappackTrack info: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, result)
	}
}

func (c *PlayerController) SearchPlayersInMappack(ctx *gin.Context) {
	mappackID := ctx.Param("mappack_id")
	query := ctx.Query("q")

	if query == "" {
		ctx.JSON(http.StatusOK, []interface{}{})
		return
	}

	limit := 5
	if limitStr := ctx.Query("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 20 {
			limit = l
		}
	}

	players, err := c.playerService.SearchPlayersInMappack(mappackID, query, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, players)
}

func (c *PlayerController) GetProfile(ctx *gin.Context) {
	playerID := ctx.Param("player_id")

	profile, err := c.playerProfileService.GetProfile(playerID)
	switch {
	case err == nil:
		ctx.JSON(http.StatusOK, profile)
	case errors.Is(err, services.ErrPlayerNotFound):
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	default:
		slog.Error("failed to load player profile", "player_id", playerID, "error", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load player profile"})
	}
}

func (c *PlayerController) GetRecentAchievements(ctx *gin.Context) {
	playerID := ctx.Param("player_id")

	limit := 20
	if l, err := strconv.Atoi(ctx.Query("limit")); err == nil && l > 0 && l <= 50 {
		limit = l
	}
	offset := 0
	if o, err := strconv.Atoi(ctx.Query("offset")); err == nil && o >= 0 {
		offset = o
	}

	achievements, err := c.playerProfileService.GetRecentAchievements(playerID, limit, offset)
	if err != nil {
		slog.Error("failed to load recent achievements", "player_id", playerID, "error", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load recent achievements"})
		return
	}
	ctx.JSON(http.StatusOK, achievements)
}
