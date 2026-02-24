// controllers/tmx_controller.go
package controllers

import (
	"example/pvm-backend/internal/clients"
	"fmt"
	"log"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type TmxController struct {
	client clients.TmxApiClient
}

func NewTmxController(client clients.TmxApiClient) *TmxController {
	return &TmxController{client}
}

func (t *TmxController) SearchTracks(c *gin.Context) {
	query := c.Query("name")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Track name is required"})
		return
	}

	fields := "MapId,OnlineMapId,Name,Uploader.UserId,Uploader.Name"
	encodedFields := url.QueryEscape(fields)

	tmxURL := fmt.Sprintf(
		"https://trackmania.exchange/api/maps?fields=%s&name=%s&count=5",
		encodedFields,
		url.QueryEscape(query),
	)

	log.Printf("Calling TMX API: %s", tmxURL)

	results, err := t.client.GetTracksByName(tmxURL)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Track fetching failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"results": results})
}
