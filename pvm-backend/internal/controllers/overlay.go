package controllers

import (
	"errors"
	"net/http"

	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const maxOverlayGoalLength = 100

type OverlayController struct {
	overlayService services.OverlayService
}

func NewOverlayController(overlayService services.OverlayService) *OverlayController {
	return &OverlayController{overlayService: overlayService}
}

// Get is public: OBS browser sources cannot sign in, so the overlay reads a
// player's selection by their id.
func (t *OverlayController) Get(c *gin.Context) {
	selection, err := t.overlayService.Get(c.Param("player_id"))
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "No overlay selection"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load overlay selection"})
		return
	}
	c.JSON(http.StatusOK, selection)
}

type overlayUpdateRequest struct {
	MappackID *string `json:"mappack_id"`
	TrackID   *string `json:"track_id"`
	Goal      *string `json:"goal"`
}

// Update changes the signed-in user's own selection: the map (mappack and track
// together), the goal, or both.
func (t *OverlayController) Update(c *gin.Context) {
	user := c.MustGet("user").(*models.User)

	var request overlayUpdateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	if (request.MappackID == nil) != (request.TrackID == nil) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mappack_id and track_id must be sent together"})
		return
	}
	if request.MappackID == nil && request.Goal == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nothing to update"})
		return
	}
	if request.Goal != nil && len(*request.Goal) > maxOverlayGoalLength {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Goal name is too long"})
		return
	}

	selection, err := t.overlayService.Update(user.ID, services.OverlayUpdate{
		MappackID: request.MappackID,
		TrackID:   request.TrackID,
		Goal:      request.Goal,
	})
	if errors.Is(err, services.ErrOverlayTrackNotInMappack) {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save overlay selection"})
		return
	}
	c.JSON(http.StatusOK, selection)
}
