package clients

import (
	"bytes"
	"encoding/json"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/models/dtos/responses"
	"example/pvm-backend/internal/utils/constants"
	"fmt"
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

	if c.accessToken != "" &&
		time.Now().Before((c.expiresAt)) {
		return c.accessToken, nil
	}
	return c.RefreshOrFetchToken()
}

func (c *TrackmaniaAPIClient) RefreshOrFetchToken() (string, error) {

	tokenResp, _ := c.FetchNewToken()
	c.accessToken = tokenResp.AccessToken
	c.expiresAt = time.Now().Add(time.Duration(tokenResp.ExpiresIn) * time.Second)

	return tokenResp.AccessToken, nil
}

func (t *TrackmaniaAPIClient) FetchNewToken() (responses.TokenResponseOAuth, error) {

	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", os.Getenv("TRACKMANIA_CLIENT_ID"))
	data.Set("client_secret", os.Getenv("TRACKMANIA_CLIENT_SECRET"))

	req, err := http.NewRequest("POST", constants.NadeoOAuthTokenURL, bytes.NewBufferString(data.Encode()))
	if err != nil {
		fmt.Println(err)
		return responses.TokenResponseOAuth{}, err
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("User-Agent", os.Getenv("USER_AGENT"))

	res, err := t.client.Do(req)
	if err != nil {
		fmt.Println(err)
		return responses.TokenResponseOAuth{}, err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		fmt.Printf("failed to fetch token: status %d\n", res.StatusCode)
		return responses.TokenResponseOAuth{}, err
	}
	tokenResponse := responses.TokenResponseOAuth{}
	json.NewDecoder(res.Body).Decode(&tokenResponse)
	return responses.TokenResponseOAuth{
		AccessToken: tokenResponse.AccessToken,
		TokenType:   tokenResponse.TokenType,
		ExpiresIn:   tokenResponse.ExpiresIn,
	}, nil
}

func (c *TrackmaniaAPIClient) DoAuthenticatedRequest(req *http.Request) (*http.Response, error) {
	token, err := c.GetToken()
	if err != nil {
		return nil, fmt.Errorf("get token: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("User-Agent", os.Getenv("USER_AGENT"))

	return c.client.Do(req)
}

func (t *TrackmaniaAPIClient) FetchPlayerNames(playerIds []string) ([]models.Player, error) {
	if len(playerIds) == 0 {
		return []models.Player{}, nil
	}

	params := url.Values{}
	for _, id := range playerIds {
		params.Add("accountId[]", id)
	}
	apiURL := fmt.Sprintf("%s/display-names?%s", constants.NadeoAPIBaseURL, params.Encode())

	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}
	resp, err := t.DoAuthenticatedRequest(req)
	if err != nil {
		return nil, fmt.Errorf("do authenticated request: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("fetch player names failed: status %d", resp.StatusCode)
	}
	var playersResponse map[string]string
	if err := json.NewDecoder(resp.Body).Decode(&playersResponse); err != nil {
		return nil, fmt.Errorf("decode response: %w", err)
	}
	players := make([]models.Player, 0, len(playersResponse))
	for accountID, displayName := range playersResponse {
		players = append(players, models.Player{
			ID:   accountID,
			Name: displayName,
		})
	}

	return players, nil
}
