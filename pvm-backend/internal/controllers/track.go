package controllers

import (
	"errors"
	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/services"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TrackController struct {
	trackService services.TrackService
	client       *clients.NadeoAPIClient
}

func NewTrackController(trackService services.TrackService) *TrackController {
	return &TrackController{trackService: trackService}
}

func (t *TrackController) Create(c *gin.Context) {
	trackTemp := models.Track{}

	err := c.ShouldBind(&trackTemp)
	track := t.client.FetchTrackInfo(trackTemp.ID)
	if err != nil {
		fmt.Printf("Error occured while binding Track during creation: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	}
	fmt.Printf(track.MapType)

	err = t.trackService.Create(track)

	if err != nil {
		fmt.Printf("Error occured while creating a Track: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.String(http.StatusOK, "Creation Succesful, %s", track)
	}
}

func (t *TrackController) GetById(c *gin.Context) {
	id := c.Param("track_id")
	track, err := t.trackService.GetById(id)
	if err != nil {
		fmt.Printf("Error occured while getting a Track by id: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, track)
	}
}

func (t *TrackController) GetByMappackId(c *gin.Context) {
	id := c.Param("mappack_id")
	tracks, err := t.trackService.GetByMappackId(id)
	if err != nil {
		fmt.Printf("Error occured while getting a Tracks from a mappack by id: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, tracks)
	}
}

func (t *TrackController) AddTrackToMappack(c *gin.Context) {
	trackId := c.Param("track_id")
	mappackId := c.Param("mappack_id")
	type Payload struct {
		TmxId string `json:"tmxId"`
	}

	var payload Payload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	err := t.trackService.AddTrackToMappack(trackId, mappackId, payload.TmxId)

	if err != nil {
		fmt.Printf("Error occured while Adding a track to mappack: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.String(http.StatusOK, "Added track to mappack succesfully")
	}
}

func (t *TrackController) RemoveTrackFromMappack(c *gin.Context) {
	trackId := c.Param("track_id")
	mappackId := c.Param("mappack_id")

	err := t.trackService.RemoveTrackFromMappack(trackId, mappackId)

	if err != nil {
		fmt.Printf("Error occured while removing a Track from mappack: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.String(http.StatusOK, "Removed track to mappack succesfully")
	}
}

func (t *TrackController) CreateTimeGoalsForTrack(c *gin.Context) {
	mappackId := c.Param("mappack_id")
	trackId := c.Param("track_id")
	var request []struct {
		ID   int `json:"id"`
		Time int `json:"time"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		fmt.Printf("Error binding timegoals: %s\n", err)
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	timegoals := make([]models.TimeGoalMappackTrack, len(request))
	for i, r := range request {
		timegoals[i] = models.TimeGoalMappackTrack{
			TimegoalID: r.ID,
			MappackID:  mappackId,
			TrackID:    trackId,
			Time:       r.Time,
			UpdatedAt:  time.Now(),
		}
	}

	err := t.trackService.CreateTimeGoalsForTrack(&timegoals)
	if err != nil {
		fmt.Printf("Error creating timegoal: %s\n", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
		return
	}

	c.String(http.StatusOK, "Creation Successful")
}

func (t *TrackController) GetTimeGoalsForTrack(c *gin.Context) {
	trackId := c.Param("track_id")
	mappackId := c.Param("mappack_id")

	timegoals, err := t.trackService.GetTimeGoalsForTrack(trackId, mappackId)

	if err != nil {
		fmt.Printf("Error occured while getting timegoals for track: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, timegoals)
	}
}

func (t *TrackController) UpdateTimeGoalsForTrack(c *gin.Context) {
	mappackID := c.Param("mappack_id")
	trackID := c.Param("track_id")
	var timegoals []models.TimeGoalMappackTrack

	err := c.ShouldBind(&timegoals)
	if err != nil {
		fmt.Printf("Error occured while binding timegoals during update: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	}

	for i := range timegoals {
		timegoals[i].MappackID = mappackID
		timegoals[i].TrackID = trackID
	}

	err = t.trackService.UpdateTimeGoalsForTrack(&timegoals)

	if err != nil {
		fmt.Printf("Error occured while updating timegoals for track: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.String(http.StatusOK, "Update Succesful")
	}
}

type updateTrackRequest struct {
	TmxID *string `json:"tmxID"`
}

// UpdateTrack patches editable track fields. Only the TMX id is editable today;
// everything else on a track comes from Nadeo and would be overwritten by the
// next sync.
func (t *TrackController) UpdateTrack(c *gin.Context) {
	trackID := c.Param("track_id")

	var request updateTrackRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload: " + err.Error()})
		return
	}

	if request.TmxID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nothing to update"})
		return
	}

	tmxID := strings.TrimSpace(*request.TmxID)
	if err := t.trackService.UpdateTmxID(trackID, tmxID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "No such track"})
			return
		}
		fmt.Printf("Error updating track %s: %s\n", trackID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update track"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"track_id": trackID, "tmxID": tmxID})
}
