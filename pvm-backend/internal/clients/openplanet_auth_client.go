package clients

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"time"
)

type OpenplanetIdentity struct {
	AccountID   string `json:"account_id"`
	DisplayName string `json:"display_name"`
	TokenTime   int64  `json:"token_time"`
}

type OpenplanetAuthClient struct {
	client *http.Client
}

func NewOpenplanetAuthClient() *OpenplanetAuthClient {
	return &OpenplanetAuthClient{
		client: &http.Client{Timeout: 10 * time.Second},
	}
}

func (c *OpenplanetAuthClient) VerifyToken(token string) (*OpenplanetIdentity, error) {
	body := url.Values{
		"token":  {token},
		"secret": {os.Getenv("OPENPLANET_PLUGIN_SECRET")},
	}

	resp, err := c.client.PostForm("https://openplanet.dev/api/auth/validate", body)
	if err != nil {
		return nil, fmt.Errorf("openplanet verify request: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		OpenplanetIdentity
		Error string `json:"error"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("decode openplanet response: %w", err)
	}
	if result.Error != "" {
		return nil, fmt.Errorf("openplanet rejected token: %s", result.Error)
	}

	return &result.OpenplanetIdentity, nil
}
