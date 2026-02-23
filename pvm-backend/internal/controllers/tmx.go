// controllers/tmx_controller.go
package controllers

import (
	"encoding/json"
	"example/pvm-backend/internal/models/dtos/responses"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type TmxController struct{}

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

	resp, err := http.Get(tmxURL)
	if err != nil {
		log.Printf("TMX API request failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search TMX"})
		return
	}
	defer resp.Body.Close()

	log.Printf("TMX API status code: %d", resp.StatusCode)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Failed to read TMX response: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read TMX response"})
		return
	}

	log.Printf("TMX API raw response: %s", string(body))

	var searchResponse responses.TmxSearchResponse
	if err := json.Unmarshal(body, &searchResponse); err != nil {
		log.Printf("Failed to parse TMX response: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse TMX response"})
		return
	}

	log.Printf("Found %d tracks", len(searchResponse.Results))

	results := make([]responses.ResponseTrack, len(searchResponse.Results))
	for i, track := range searchResponse.Results {
		thumbnailURL := fmt.Sprintf("https://trackmania.exchange/mapthumb/%d", track.MapId)

		results[i] = responses.ResponseTrack{
			TrackID:      track.MapId,
			MapUUID:      track.OnlineMapId,
			Name:         track.Name,
			AuthorName:   track.Uploader.Name,
			ThumbnailURL: thumbnailURL,
		}
	}

	c.JSON(http.StatusOK, gin.H{"results": results})
}
