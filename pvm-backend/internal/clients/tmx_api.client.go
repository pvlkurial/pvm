package clients

import (
	"encoding/json"
	"example/pvm-backend/internal/models/dtos/responses"
	"fmt"
	"io"
	"log"
	"net/http"
)

type TmxApiClient struct {
}

func (c TmxApiClient) GetTracksByName(tmxURL string) ([]responses.ResponseTrack, error) {
	resp, err := http.Get(tmxURL)
	if err != nil {
		log.Printf("TMX API request failed: %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	log.Printf("TMX API status code: %d", resp.StatusCode)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Failed to read TMX response: %v", err)
		return nil, err
	}
	var searchResponse responses.TmxSearchResponse
	if err := json.Unmarshal(body, &searchResponse); err != nil {
		log.Printf("Failed to parse TMX response: %v", err)
		return nil, err

	}
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
	return results, nil
}
