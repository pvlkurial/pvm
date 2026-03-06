package clients

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/models/dtos/responses"
	"example/pvm-backend/internal/utils/constants"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"time"
)

type tokenData struct {
	accessToken  string
	refreshToken string
	expiresAt    time.Time
}

type NadeoAPIClient struct {
	client *http.Client
	tokens map[string]*tokenData
}

func NewNadeoAPIClient() *NadeoAPIClient {
	return &NadeoAPIClient{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
		tokens: make(map[string]*tokenData),
	}
}

// Call this to get a token for the given audience.
func (c *NadeoAPIClient) GetToken(audience string) (string, error) {
	data, exists := c.tokens[audience]

	if exists && data.accessToken != "" &&
		time.Now().Add(constants.TokenExpirationBufferInMinutes*time.Minute).Before(data.expiresAt) {
		slog.Debug("using cached token", "audience", audience, "expires_at", data.expiresAt)
		return data.accessToken, nil
	}

	return c.RefreshOrFetchToken(audience)
}

func (c *NadeoAPIClient) RefreshOrFetchToken(audience string) (string, error) {
	if data, exists := c.tokens[audience]; exists {
		if data.accessToken != "" && time.Now().Add(constants.TokenExpirationBufferInMinutes*time.Minute).Before(data.expiresAt) {
			return data.accessToken, nil
		}
	}

	var tokenResp responses.TokenResponse
	var err error

	if data, exists := c.tokens[audience]; exists && data.refreshToken != "" {
		slog.Debug("attempting token refresh", "audience", audience)
		tokenResp, err = c.FetchTokenWithRefreshToken(data.refreshToken)
		if err != nil {
			slog.Warn("token refresh failed, falling back to full auth", "audience", audience, "error", err)
			tokenResp, err = c.FetchNewToken(audience)
		}
	} else {
		slog.Debug("fetching new token", "audience", audience)
		tokenResp, err = c.FetchNewToken(audience)
	}

	if err != nil {
		slog.Error("failed to obtain token", "audience", audience, "error", err)
		return "", err
	}

	expiresAt, err := c.parseTokenExpiration(tokenResp.AccessToken)
	if err != nil {
		slog.Warn("could not parse token expiration, defaulting to 1h", "audience", audience, "error", err)
		expiresAt = time.Now().Add(1 * time.Hour)
	}

	c.tokens[audience] = &tokenData{
		accessToken:  tokenResp.AccessToken,
		refreshToken: tokenResp.RefreshToken,
		expiresAt:    expiresAt,
	}

	slog.Info("token obtained", "audience", audience, "expires_at", expiresAt)
	return tokenResp.AccessToken, nil
}

func (c *NadeoAPIClient) FetchNewToken(audience string) (responses.TokenResponse, error) {
	body := map[string]string{
		"audience": audience,
	}
	jsonBody, err := json.Marshal(body)
	if err != nil {
		slog.Error("failed to marshal token request body", "audience", audience, "error", err)
		return responses.TokenResponse{}, err
	}

	req, err := http.NewRequest("POST", constants.NadeoTokenURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		slog.Error("failed to create token request", "audience", audience, "error", err)
		return responses.TokenResponse{}, err
	}
	req.SetBasicAuth(os.Getenv("NADEO_API_USERNAME"), os.Getenv("NADEO_API_PASSWORD"))
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("User-Agent", os.Getenv("USER_AGENT"))

	res, err := c.client.Do(req)
	if err != nil {
		slog.Error("token request failed", "audience", audience, "error", err)
		return responses.TokenResponse{}, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		slog.Error("token endpoint returned non-200", "audience", audience, "status", res.StatusCode)
		return responses.TokenResponse{}, fmt.Errorf("token request failed with status %d", res.StatusCode)
	}

	var tokenResponse responses.TokenResponse
	if err := json.NewDecoder(res.Body).Decode(&tokenResponse); err != nil {
		slog.Error("failed to decode token response", "audience", audience, "error", err)
		return responses.TokenResponse{}, err
	}

	return tokenResponse, nil
}

func (c *NadeoAPIClient) FetchTokenWithRefreshToken(refreshToken string) (responses.TokenResponse, error) {
	req, err := http.NewRequest("POST", constants.NadeoRefreshURL, nil)
	if err != nil {
		return responses.TokenResponse{}, fmt.Errorf("create request: %w", err)
	}

	req.Header.Set("Authorization", "nadeo_v1 t="+refreshToken)
	req.Header.Set("User-Agent", os.Getenv("USER_AGENT"))

	res, err := c.client.Do(req)
	if err != nil {
		return responses.TokenResponse{}, fmt.Errorf("do request: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return responses.TokenResponse{}, fmt.Errorf("refresh token failed: status %d", res.StatusCode)
	}

	var resp responses.TokenResponse
	if err := json.NewDecoder(res.Body).Decode(&resp); err != nil {
		return responses.TokenResponse{}, fmt.Errorf("decode response: %w", err)
	}

	return resp, nil
}

func (c *NadeoAPIClient) parseTokenExpiration(token string) (time.Time, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return time.Time{}, fmt.Errorf("invalid JWT format: expected 3 parts, got %d", len(parts))
	}

	payload, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return time.Time{}, fmt.Errorf("decode JWT payload: %w", err)
	}

	var claims struct {
		Exp int64 `json:"exp"`
	}
	if err := json.Unmarshal(payload, &claims); err != nil {
		return time.Time{}, fmt.Errorf("unmarshal JWT claims: %w", err)
	}

	return time.Unix(claims.Exp, 0), nil
}


func (c *NadeoAPIClient) DoAuthenticatedRequest(req *http.Request, audience string) (*http.Response, error) {
	token, err := c.GetToken(audience)
	if err != nil {
		slog.Error("failed to get token for authenticated request",
			"audience", audience,
			"method", req.Method,
			"url", req.URL.String(),
			"error", err,
		)
		return nil, err
	}

	req.Header.Set("Authorization", "nadeo_v1 t="+token)
	req.Header.Set("User-Agent", os.Getenv("USER_AGENT"))

	return c.client.Do(req)
}

func (c *NadeoAPIClient) FetchTrackInfo(trackID string) *models.Track {
	req, err := http.NewRequest("GET", "https://prod.trackmania.core.nadeo.online/maps/"+trackID, nil)
	if err != nil {
		slog.Error("failed to create track info request", "track_id", trackID, "error", err)
		return nil
	}

	resp, err := c.DoAuthenticatedRequest(req, constants.NadeoServices)
	if err != nil {
		slog.Error("track info request failed", "track_id", trackID, "error", err)
		return nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		slog.Error("track info endpoint returned non-200", "track_id", trackID, "status", resp.StatusCode)
		return nil
	}

	var track models.Track
	if err := json.NewDecoder(resp.Body).Decode(&track); err != nil {
		slog.Error("failed to decode track info response", "track_id", trackID, "error", err)
		return nil
	}

	track.ID = track.MapID
	return &track
}

func (c *NadeoAPIClient) FetchRecordsOfTrack(trackUID string, length int, offset int) ([]models.Record, error) {
	url := fmt.Sprintf("%s%s/top?onlyWorld=true&length=%d&offset=%d",
		constants.LeaderboardURL, trackUID, length, offset)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		slog.Error("failed to create records request", "track_uid", trackUID, "error", err)
		return nil, fmt.Errorf("create request: %w", err)
	}

	resp, err := c.DoAuthenticatedRequest(req, constants.NadeoLiveServices)
	if err != nil {
		slog.Error("records request failed", "track_uid", trackUID, "error", err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		slog.Error("records endpoint returned non-200", "track_uid", trackUID, "status", resp.StatusCode)
		return nil, fmt.Errorf("records request failed with status %d", resp.StatusCode)
	}

	var response models.TrackRecordsResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		slog.Error("failed to decode records response", "track_uid", trackUID, "error", err)
		return nil, err
	}

	if len(response.Tops) == 0 {
		slog.Warn("no tops data in records response", "track_uid", trackUID)
		return []models.Record{}, nil
	}

	return response.Tops[0].Top, nil
}

func (c *NadeoAPIClient) FetchRecordsOfTrackForPlayer(trackID string, playerID string, trackUID string) (models.Record, error) {
	url := fmt.Sprintf("%sby-account/?accountIdList=%s&mapId=%s",
		constants.GetMapRecordByAccountURL, playerID, trackID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		slog.Error("failed to create player record request",
			"track_id", trackID,
			"player_id", playerID,
			"error", err,
		)
		return models.Record{}, fmt.Errorf("create request: %w", err)
	}

	resp, err := c.DoAuthenticatedRequest(req, constants.NadeoServices)
	if err != nil {
		slog.Error("player record request failed",
			"track_id", trackID,
			"player_id", playerID,
			"error", err,
		)
		return models.Record{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		slog.Error("player record endpoint returned non-200",
			"track_id", trackID,
			"player_id", playerID,
			"status", resp.StatusCode,
		)
		return models.Record{}, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var response []models.PlayerRecordResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		slog.Error("failed to decode player record response",
			"track_id", trackID,
			"player_id", playerID,
			"error", err,
		)
		return models.Record{}, err
	}

	if len(response) == 0 {
		slog.Warn("no record found for player on track", "track_id", trackID, "player_id", playerID)
		return models.Record{}, fmt.Errorf("no records found for player")
	}

	return models.Record{
		PlayerID:   playerID,
		TrackID:    trackID,
		RecordTime: response[0].RecordScore.Time,
		Position:   0,
		ZoneID:     "-",
		ZoneName:   "World",
	}, nil
}
