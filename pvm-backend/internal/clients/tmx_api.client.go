package clients

import (
	"encoding/json"
	"example/pvm-backend/internal/models/dtos/responses"
	"fmt"
	"io"
	"log/slog"
	"net/http"
)

type TmxApiClient struct{}

func (c TmxApiClient) GetTracksByName(tmxURL string) ([]responses.ResponseTrack, error) {
	resp, err := http.Get(tmxURL)
	if err != nil {
		slog.Error("TMX API request failed", "url", tmxURL, "error", err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		slog.Error("TMX API returned non200", "url", tmxURL, "status", resp.StatusCode)
		return nil, fmt.Errorf("TMX API request failed with status %d", resp.StatusCode)
	}

	slog.Debug("TMX API response received", "url", tmxURL, "status", resp.StatusCode)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		slog.Error("failed to read TMX response body", "url", tmxURL, "error", err)
		return nil, err
	}

	var searchResponse responses.TmxSearchResponse
	if err := json.Unmarshal(body, &searchResponse); err != nil {
		slog.Error("failed to parse TMX response", "url", tmxURL, "error", err)
		return nil, err
	}

	results := make([]responses.ResponseTrack, len(searchResponse.Results))
	for i, track := range searchResponse.Results {
		results[i] = responses.ResponseTrack{
			TrackID:      track.MapId,
			MapUUID:      track.OnlineMapId,
			Name:         track.Name,
			AuthorName:   track.Uploader.Name,
			ThumbnailURL: fmt.Sprintf("https://trackmania.exchange/mapthumb/%d", track.MapId),
		}
	}

	slog.Info("TMX tracks fetched", "url", tmxURL, "count", len(results))
	return results, nil
}
