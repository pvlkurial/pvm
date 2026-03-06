package clients

import (
	"bytes"
	"encoding/json"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/models/dtos/responses"
	"example/pvm-backend/internal/utils/constants"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"time"
)

type TrackmaniaAPIClient struct {
	client      *http.Client
	accessToken string
	expiresAt   time.Time
}

func NewTrackmaniaAPIClient() *TrackmaniaAPIClient {
	return &TrackmaniaAPIClient{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (c *TrackmaniaAPIClient) GetToken() (string, error) {
	if c.accessToken != "" && time.Now().Before(c.expiresAt) {
		slog.Debug("using cached OAuth token", "expires_at", c.expiresAt)
		return c.accessToken, nil
	}

	return c.RefreshOrFetchToken()
}

func (c *TrackmaniaAPIClient) RefreshOrFetchToken() (string, error) {
	slog.Debug("fetching new OAuth token")

	tokenResp, err := c.FetchNewToken()
	if err != nil {
		slog.Error("failed to fetch OAuth token", "error", err)
		return "", err
	}

	c.accessToken = tokenResp.AccessToken
	c.expiresAt = time.Now().Add(time.Duration(tokenResp.ExpiresIn) * time.Second)

	slog.Info("OAuth token obtained", "expires_at", c.expiresAt)
	return tokenResp.AccessToken, nil
}

func (c *TrackmaniaAPIClient) FetchNewToken() (responses.TokenResponseOAuth, error) {
	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", os.Getenv("TRACKMANIA_CLIENT_ID"))
	data.Set("client_secret", os.Getenv("TRACKMANIA_CLIENT_SECRET"))

	req, err := http.NewRequest("POST", constants.NadeoOAuthTokenURL, bytes.NewBufferString(data.Encode()))
	if err != nil {
		slog.Error("failed to create OAuth token request", "error", err)
		return responses.TokenResponseOAuth{}, err
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("User-Agent", os.Getenv("USER_AGENT"))

	res, err := c.client.Do(req)
	if err != nil {
		slog.Error("OAuth token request failed", "error", err)
		return responses.TokenResponseOAuth{}, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		slog.Error("OAuth token endpoint returned non-200", "status", res.StatusCode)
		return responses.TokenResponseOAuth{}, fmt.Errorf("OAuth token request failed with status %d", res.StatusCode)
	}

	var tokenResponse responses.TokenResponseOAuth
	if err := json.NewDecoder(res.Body).Decode(&tokenResponse); err != nil {
		slog.Error("failed to decode OAuth token response", "error", err)
		return responses.TokenResponseOAuth{}, err
	}

	return tokenResponse, nil
}

func (c *TrackmaniaAPIClient) DoAuthenticatedRequest(req *http.Request) (*http.Response, error) {
	token, err := c.GetToken()
	if err != nil {
		slog.Error("failed to get token for authenticated request",
			"method", req.Method,
			"url", req.URL.String(),
			"error", err,
		)
		return nil, fmt.Errorf("get token: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("User-Agent", os.Getenv("USER_AGENT"))

	return c.client.Do(req)
}

func (c *TrackmaniaAPIClient) FetchPlayerNames(playerIds []string) ([]models.Player, error) {
	if len(playerIds) == 0 {
		slog.Debug("FetchPlayerNames called with empty player list, skipping")
		return []models.Player{}, nil
	}

	params := url.Values{}
	for _, id := range playerIds {
		params.Add("accountId[]", id)
	}

	apiURL := fmt.Sprintf("%s/display-names?%s", constants.NadeoAPIBaseURL, params.Encode())
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		slog.Error("failed to create player names request", "error", err)
		return nil, fmt.Errorf("create request: %w", err)
	}

	resp, err := c.DoAuthenticatedRequest(req)
	if err != nil {
		slog.Error("player names request failed", "error", err)
		return nil, fmt.Errorf("do authenticated request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		slog.Error("player names endpoint returned non-200", "status", resp.StatusCode)
		return nil, fmt.Errorf("fetch player names failed: status %d", resp.StatusCode)
	}

	var playersResponse map[string]string
	if err := json.NewDecoder(resp.Body).Decode(&playersResponse); err != nil {
		slog.Error("failed to decode player names response", "error", err)
		return nil, fmt.Errorf("decode response: %w", err)
	}

	players := make([]models.Player, 0, len(playersResponse))
	for accountID, displayName := range playersResponse {
		players = append(players, models.Player{
			ID:   accountID,
			Name: displayName,
		})
	}

	slog.Info("player names fetched", "requested", len(playerIds), "returned", len(players))
	return players, nil
}
