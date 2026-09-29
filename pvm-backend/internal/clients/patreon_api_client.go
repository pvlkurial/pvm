package clients

import (
	"encoding/json"
	"example/pvm-backend/internal/utils/constants"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"time"
)

// PatreonAPIClient talks to Patreon's OAuth and API v2 on behalf of a user who
// is connecting their Patreon profile.
type PatreonAPIClient struct {
	client       *http.Client
	clientID     string
	clientSecret string
	redirectURI  string
}

func NewPatreonAPIClient() *PatreonAPIClient {
	return &PatreonAPIClient{
		client:       &http.Client{Timeout: 30 * time.Second},
		clientID:     os.Getenv("PATREON_CLIENT_ID"),
		clientSecret: os.Getenv("PATREON_CLIENT_SECRET"),
		redirectURI:  os.Getenv("PATREON_REDIRECT_URI"),
	}
}

// IsConfigured reports whether the OAuth app credentials are set.
func (c *PatreonAPIClient) IsConfigured() bool {
	return c.clientID != "" && c.clientSecret != "" && c.redirectURI != ""
}

// AuthorizeURL is where the user is sent to approve the connection.
// identity.memberships lets us see their pledge to this campaign.
func (c *PatreonAPIClient) AuthorizeURL(state string) string {
	params := url.Values{}
	params.Add("response_type", "code")
	params.Add("client_id", c.clientID)
	params.Add("redirect_uri", c.redirectURI)
	params.Add("scope", "identity identity.memberships")
	params.Add("state", state)
	return fmt.Sprintf("%s?%s", constants.PatreonAuthorizeURL, params.Encode())
}

// ExchangeCode trades the authorization code for the user's access token. The
// token is only used once, to read their identity, and is not stored.
func (c *PatreonAPIClient) ExchangeCode(code string) (string, error) {
	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("code", code)
	data.Set("client_id", c.clientID)
	data.Set("client_secret", c.clientSecret)
	data.Set("redirect_uri", c.redirectURI)

	resp, err := c.client.PostForm(constants.PatreonTokenURL, data)
	if err != nil {
		return "", fmt.Errorf("patreon token request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("patreon token exchange failed (status %d): %s", resp.StatusCode, body)
	}

	var tokenResp struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return "", fmt.Errorf("decode patreon token: %w", err)
	}
	return tokenResp.AccessToken, nil
}

// PatreonRef is a JSON:API resource identifier.
type PatreonRef struct {
	ID   string `json:"id"`
	Type string `json:"type"`
}

// PatreonResource covers the fields we read from users and members. Both the
// identity endpoint and the member webhooks return resources in this shape.
type PatreonResource struct {
	ID         string `json:"id"`
	Type       string `json:"type"`
	Attributes struct {
		FullName     string  `json:"full_name"`
		PatronStatus *string `json:"patron_status"`
	} `json:"attributes"`
	Relationships struct {
		Campaign struct {
			Data *PatreonRef `json:"data"`
		} `json:"campaign"`
		CurrentlyEntitledTiers struct {
			Data []PatreonRef `json:"data"`
		} `json:"currently_entitled_tiers"`
		User struct {
			Data *PatreonRef `json:"data"`
		} `json:"user"`
	} `json:"relationships"`
}

// PatreonDocument is a JSON:API document: the primary resource plus includes.
type PatreonDocument struct {
	Data     PatreonResource   `json:"data"`
	Included []PatreonResource `json:"included"`
}

// Members returns the included member resources, i.e. the user's pledges.
func (d *PatreonDocument) Members() []PatreonResource {
	members := []PatreonResource{}
	for _, resource := range d.Included {
		if resource.Type == "member" {
			members = append(members, resource)
		}
	}
	return members
}

// FetchIdentity reads the user behind the token together with their memberships.
func (c *PatreonAPIClient) FetchIdentity(accessToken string) (*PatreonDocument, error) {
	params := url.Values{}
	params.Add("include", "memberships,memberships.campaign,memberships.currently_entitled_tiers")
	params.Add("fields[user]", "full_name")
	params.Add("fields[member]", "patron_status")

	req, err := http.NewRequest("GET", fmt.Sprintf("%s?%s", constants.PatreonIdentityURL, params.Encode()), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("User-Agent", os.Getenv("USER_AGENT"))

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("patreon identity request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("patreon identity failed (status %d): %s", resp.StatusCode, body)
	}

	var identity PatreonDocument
	if err := json.NewDecoder(resp.Body).Decode(&identity); err != nil {
		return nil, fmt.Errorf("decode patreon identity: %w", err)
	}
	return &identity, nil
}
