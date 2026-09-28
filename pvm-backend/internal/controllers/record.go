package controllers

import (
	"errors"
	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/models/dtos"
	"example/pvm-backend/internal/services"
	"log/slog"
	"math"
	"strconv"
	"time"

	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RecordController struct {
	recordService        services.RecordService
	recordRefreshService services.RecordRefreshService
	client               *clients.NadeoAPIClient
	trackService         services.TrackService
	achievmentService    services.AchievementService
}

func NewRecordController(recordService services.RecordService, recordRefreshService services.RecordRefreshService,
	trackService services.TrackService, client *clients.NadeoAPIClient, achievmentService services.AchievementService) *RecordController {
	return &RecordController{
		recordService:        recordService,
		recordRefreshService: recordRefreshService,
		trackService:         trackService,
		achievmentService:    achievmentService,
		client:               client,
	}
}

func (t *RecordController) Create(c *gin.Context) {
	record := models.Record{}

	err := c.ShouldBind(&record)
	if err != nil {
		fmt.Printf("Error occured while binding Record during creation: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	}

	err = t.recordService.Create(&record)

	if err != nil {
		fmt.Printf("Error occured while creating a Record: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.String(http.StatusOK, "Creation Succesful")
	}

}

func (t *RecordController) GetById(c *gin.Context) {
	id := c.Param("id")
	record, err := t.recordService.GetById(id)
	if err != nil {
		fmt.Printf("Error occured while getting a Record by id: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, record)
	}
}

func (t *RecordController) GetByTrackId(c *gin.Context) {
	trackId := c.Param("track_id")
	track, err := t.trackService.GetById(trackId)
	if err != nil {
		fmt.Printf("Error occured while getting Track by id: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
		return
	}
	records, err := t.recordService.GetByTrackId(track.MapID)
	if err != nil {
		fmt.Printf("Error occured while getting Records by Track id: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, records)
	}
}

func (t *RecordController) GetPlayersRecordsForTrack(c *gin.Context) {
	trackId := c.Param("track_id")
	playerId := c.Param("player_id")
	records, err := t.recordService.GetPlayersRecordsForTrack(trackId, playerId)
	if err != nil {
		fmt.Printf("Error occured while getting Player's Records for Track: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, records)
	}
}

// TODO: put logic of this in service later okg
func (t *RecordController) FetchNewTrackRecords(c *gin.Context) {
	trackId := c.Param("track_id")
	track, err := t.trackService.GetById(trackId)
	if err != nil {
		fmt.Printf("Error occurred while fetching Track by ID: %s\n", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
		return
	}

	recordList, err := t.client.FetchRecordsOfTrack(track.MapUID, 5, 0)

	if err != nil {
		fmt.Println("Failed to fetch records")
		c.String(http.StatusInternalServerError, "Failed to fetch records")
		return
	}

	if len(recordList) == 0 {
		c.String(http.StatusOK, "No records found")
		return
	}

	for i := range recordList {
		(recordList)[i].TrackID = track.ID
		(recordList)[i].ID = fmt.Sprintf("%s_%s", track.ID, (recordList)[i].PlayerID)
		(recordList)[i].UpdatedAt = time.Now()
	}

	err = t.recordService.SaveFetchedRecords(&recordList)

	if err == nil {
		c.String(http.StatusOK, "No records to save")
		return
	}

	if err != nil {
		fmt.Printf("Error occurred while creating a Record: %s\n", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Records saved successfully", "count": len(recordList)})
}
func (t *RecordController) GetTrackWithRecords(c *gin.Context) {
	trackId := c.Param("track_id")
	mappack_id := c.Param("mappack_id")
	playerID := c.Query("player_id")
	var track dtos.TrackInMappackDto
	track, err := t.recordService.GetTrackWithRecords(mappack_id, trackId, &playerID)
	if err != nil {
		fmt.Printf("Error occurred while creating a Record: %s\n", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	}
	c.JSON(http.StatusOK, track)
}

func (t *RecordController) GetUIDTrackWithRecords(c *gin.Context) {
	trackId := c.Param("track_uid")
	mappack_id := c.Param("mappack_id")
	playerID := c.Query("player_id")
	var track dtos.TrackInMappackDto
	track, err := t.recordService.GetTrackUIDWithRecords(mappack_id, trackId, &playerID)
	if err != nil {
		fmt.Printf("Error occurred while creating a Record: %s\n", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	}
	c.JSON(http.StatusOK, track)
}

// RefreshOwnRecord pulls the signed-in user's own record for a track from
// Nadeo. For supporters and superadmins, and rate-limited per user.
func (t *RecordController) RefreshOwnRecord(c *gin.Context) {
	user := c.MustGet("user").(*models.User)

	err := t.recordRefreshService.RefreshOwnRecord(user, c.Param("track_id"))
	var cooldown *services.RecordRefreshCooldownError
	switch {
	case err == nil:
		c.JSON(http.StatusOK, gin.H{"message": "Record refreshed"})
	case errors.As(err, &cooldown):
		seconds := int(math.Ceil(cooldown.RetryAfter.Seconds()))
		c.Header("Retry-After", strconv.Itoa(seconds))
		c.JSON(http.StatusTooManyRequests, gin.H{"error": cooldown.Error(), "retry_after_seconds": seconds})
	case errors.Is(err, services.ErrRecordRefreshNotAllowed):
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
	case errors.Is(err, services.ErrNoRecordOnTrack), errors.Is(err, services.ErrRefreshTrackNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	default:
		slog.Error("record refresh failed", "player_id", user.ID, "track_id", c.Param("track_id"), "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to refresh record"})
	}
}

func (c *RecordController) SubmitPluginPB(ctx *gin.Context) {
	var req struct {
		MapUID string `json:"mapUid" binding:"required"`
		Time   int    `json:"time" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := ctx.MustGet("user").(*models.User)

	track, err := c.trackService.GetByUID(req.MapUID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "track not found"})
		return
	}

	// The plugin submits a PB as soon as it is driven, so it was set just now.
	now := time.Now()
	record := models.Record{
		ID:         fmt.Sprintf("%s_%s", track.ID, user.ID),
		TrackID:    track.ID,
		PlayerID:   user.ID,
		RecordTime: req.Time,
		Timestamp:  now.Unix(),
		UpdatedAt:  now,
	}
	records := []models.Record{record}

	if err := c.recordService.SaveFetchedRecords(&records); err != nil {
		slog.Error("failed to save plugin PB", "player_id", user.ID, "error", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save record"})
		return
	}

	for _, mappackTrack := range track.MappackTrack {
		if err := c.trackService.SavePlayerMappackTrack(
			mappackTrack.MappackID,
			mappackTrack.TrackID,
			user.ID,
			req.Time,
		); err != nil {
			slog.Error("failed to save player mappack track",
				"mappack_id", mappackTrack.MappackID,
				"player_id", user.ID,
				"error", err,
			)
		}

		if err := c.achievmentService.CheckAndUpdateAchievements(
			user.ID,
			mappackTrack.MappackID,
			mappackTrack.TrackID,
			req.Time,
			now,
		); err != nil {
			slog.Error("failed to update achievements",
				"mappack_id", mappackTrack.MappackID,
				"player_id", user.ID,
				"error", err,
			)
		}
	}
	ctx.JSON(http.StatusOK, gin.H{"personal_best": req.Time})
}
