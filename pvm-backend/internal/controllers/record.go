package controllers

import (
	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/models/dtos"
	"example/pvm-backend/internal/services"
	"time"

	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RecordController struct {
	recordService services.RecordService
	client        *clients.NadeoAPIClient
	trackService  services.TrackService
}

func NewRecordController(recordService services.RecordService, trackService services.TrackService,
	client *clients.NadeoAPIClient) *RecordController {
	return &RecordController{
		recordService: recordService,
		trackService:  trackService,
		client:        client}
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

func (t *RecordController) FetchPlayersRecordsForTrack(c *gin.Context) {
	trackId := c.Param("track_id")
	playerId := c.Param("player_id")
	track, err := t.trackService.GetById(trackId)

	if err != nil {
		fmt.Printf("Error occurred while fetching Track by ID: %s\n", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
		return
	}

	record, err := t.client.FetchRecordsOfTrackForPlayer(track.ID, playerId, track.MapUID)

	if err != nil {
		fmt.Println("Failed to fetch records")
		c.String(http.StatusInternalServerError, "Failed to fetch records")
		return
	}

	record.ID = fmt.Sprintf("%s_%s", track.ID, record.PlayerID)
	record.UpdatedAt = time.Now()
	records := []models.Record{record}

	err = t.recordService.SaveFetchedRecords(&records)

	if err == nil {
		c.String(http.StatusOK, "No records to save")
		return
	}

	if err != nil {
		fmt.Printf("Error occurred while creating a Record: %s\n", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Records saved successfully", "count": len(records)})
}
