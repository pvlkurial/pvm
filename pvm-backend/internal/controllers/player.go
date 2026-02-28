package controllers

import (
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/services"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PlayerController struct {
	playerService services.PlayerService
}

func NewPlayerController(playerService services.PlayerService) *PlayerController {
	return &PlayerController{playerService: playerService}
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
