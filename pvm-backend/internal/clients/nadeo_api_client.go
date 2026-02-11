package clients

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/models/dtos/responses"
	"example/pvm-backend/internal/utils/constants"
	"fmt"
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
func (c *NadeoAPIClient) GetToken(audience string) (string, error) {
	data, exists := c.tokens[audience]

	if exists && data.accessToken != "" &&
		time.Now().Add(constants.TokenExpirationBufferInMinutes*time.Minute).Before(data.expiresAt) {
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
		tokenResp, err = c.FetchTokenWithRefreshToken(data.refreshToken)
		if err != nil {
			tokenResp, err = c.FetchNewToken(audience)
		}
	} else {
		tokenResp, err = c.FetchNewToken(audience)
	}

	if err != nil {
		return "", err
	}

	expiresAt, err := c.parseTokenExpiration(tokenResp.AccessToken)
	if err != nil {
		expiresAt = time.Now().Add(1 * time.Hour)
	}

	c.tokens[audience] = &tokenData{
		accessToken:  tokenResp.AccessToken,
		refreshToken: tokenResp.RefreshToken,
		expiresAt:    expiresAt,
	}

	return tokenResp.AccessToken, nil
}

func (t *NadeoAPIClient) FetchNewToken(audience string) (responses.TokenResponse, error) {

	body := map[string]string{
		"audience": audience,
	}
	jsonBody, err := json.Marshal(body)
	if err != nil {
		fmt.Println(err)
		return responses.TokenResponse{}, err
	}

	req, err := http.NewRequest("POST", constants.NadeoTokenURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		fmt.Println(err)
		return responses.TokenResponse{}, err
	}
	req.SetBasicAuth(os.Getenv("NADEO_API_USERNAME"), os.Getenv("NADEO_API_PASSWORD"))
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("User-Agent", os.Getenv("USER_AGENT"))

	res, err := t.client.Do(req)
	if err != nil {
		fmt.Println(err)
		return responses.TokenResponse{}, err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		fmt.Printf("failed to fetch token: status %d\n", res.StatusCode)
		return responses.TokenResponse{}, err
	}
	tokenResponse := responses.TokenResponse{}
	json.NewDecoder(res.Body).Decode(&tokenResponse)
	return responses.TokenResponse{
		AccessToken:  tokenResponse.AccessToken,
		RefreshToken: tokenResponse.RefreshToken,
	}, nil
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
		return time.Time{}, fmt.Errorf("invalid JWT format")
	}

	payload, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return time.Time{}, err
	}

	var claims struct {
		Exp int64 `json:"exp"`
	}
	if err := json.Unmarshal(payload, &claims); err != nil {
		return time.Time{}, err
	}

	return time.Unix(claims.Exp, 0), nil
}
func (c *NadeoAPIClient) DoAuthenticatedRequest(req *http.Request, audience string) (*http.Response, error) {
	token, err := c.GetToken(audience)
	if err != nil {
		return nil, fmt.Errorf("get token: %w", err)
	}
	req.Header.Set("Authorization", "nadeo_v1 t="+token)
	req.Header.Set("User-Agent", os.Getenv("USER_AGENT"))

	return c.client.Do(req)
}

func (t *NadeoAPIClient) FetchTrackInfo(trackid string) *models.Track {
	req, err := http.NewRequest("GET", "https://prod.trackmania.core.nadeo.online/maps/"+trackid, nil)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	resp, err := t.DoAuthenticatedRequest(req, constants.NadeoServices)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("failed to fetch track: status %d\n", resp.StatusCode)
		return nil
	}

	track := &models.Track{}
	if err := json.NewDecoder(resp.Body).Decode(track); err != nil {
		fmt.Println(err)
		return nil
	}

	track.ID = track.MapID
	return track
}

func (t *NadeoAPIClient) FetchRecordsOfTrack(trackuid string, length int, offset int) ([]models.Record, error) {
	url := fmt.Sprintf("%s%s/top?onlyWorld=true&length=%d&offset=%d",
		constants.LeaderboardURL, trackuid, length, offset)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}
	resp, err := t.DoAuthenticatedRequest(req, constants.NadeoLiveServices)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("failed to fetch records: status %d\n", resp.StatusCode)
		return nil, err
	}

	var response models.TrackRecordsResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		fmt.Printf("failed to decode records: %v\n", err)
		return nil, err
	}

	if len(response.Tops) == 0 {
		fmt.Println("no tops data in response")
		return []models.Record{}, nil
	}

	records := response.Tops[0].Top

	return records, nil

}

func (t *NadeoAPIClient) FetchRecordsOfTrackForPlayer(trackID string, playerId string, trackUID string) (models.Record, error) {
	// First request - get player's record time
	url := fmt.Sprintf("%sby-account/?accountIdList=%s&mapId=%s",
		constants.GetMapRecordByAccountURL, playerId, trackID)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return models.Record{}, fmt.Errorf("create request: %w", err)
	}

	resp, err := t.DoAuthenticatedRequest(req, constants.NadeoServices)
	if err != nil {
		fmt.Println(err)
		return models.Record{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("failed to fetch records: status %d\n", resp.StatusCode)
		return models.Record{}, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var response []models.PlayerRecordResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		fmt.Printf("failed to decode records: %v\n", err)
		return models.Record{}, err
	}

	if len(response) == 0 {
		return models.Record{}, fmt.Errorf("no records found for player")
	}

	// Extract position and zone info
	position := 0
	zoneID := "-"
	zoneName := "World"

	record := models.Record{
		PlayerID:   playerId,
		TrackID:    trackID,
		RecordTime: response[0].RecordScore.Time,
		Position:   position,
		ZoneID:     zoneID,
		ZoneName:   zoneName,
	}

	return record, nil
}
