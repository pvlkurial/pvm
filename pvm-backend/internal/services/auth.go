package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"example/pvm-backend/internal/models"

	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

type AuthService struct {
	db           *gorm.DB
	ClientID     string
	clientSecret string
	RedirectURI  string
	jwtSecret    string
}

func NewAuthService(db *gorm.DB, ClientID, clientSecret, RedirectURI, jwtSecret string) *AuthService {
	return &AuthService{
		db:           db,
		ClientID:     ClientID,
		clientSecret: clientSecret,
		RedirectURI:  RedirectURI,
		jwtSecret:    jwtSecret,
	}
}

type TrackmaniaTokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
}

type TrackmaniaUser struct {
	AccountID string `json:"accountId"`
	Name      string `json:"displayName"`
}

func (s *AuthService) ExchangeCodeForToken(code, redirectURI string) (*TrackmaniaTokenResponse, error) {
	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("client_id", s.ClientID)
	data.Set("client_secret", s.clientSecret)
	data.Set("code", code)
	data.Set("redirect_uri", redirectURI)

	resp, err := http.PostForm("https://api.trackmania.com/api/access_token", data)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("token exchange failed (status %d): %s", resp.StatusCode, body)
	}

	var tokenResp TrackmaniaTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return nil, err
	}

	return &tokenResp, nil
}

func (s *AuthService) GetTrackmaniaUser(accessToken string) (*TrackmaniaUser, error) {
	req, err := http.NewRequest("GET", "https://api.trackmania.com/api/user", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("failed to get user: %s", body)
	}

	var user TrackmaniaUser
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *AuthService) CreateOrUpdateUser(tmUser *TrackmaniaUser) (*models.User, error) {
	var user models.User

	err := s.db.Where("id = ?", tmUser.AccountID).First(&user).Error

	if err == gorm.ErrRecordNotFound {
		user = models.User{
			ID:   tmUser.AccountID,
			Name: tmUser.Name,
			Role: "user",
		}
		if err := s.db.Create(&user).Error; err != nil {
			return nil, err
		}
	} else if err == nil {
		user.Name = tmUser.Name
		if err := s.db.Save(&user).Error; err != nil {
			return nil, err
		}
	} else {
		return nil, err
	}

	return &user, nil
}

func (s *AuthService) GenerateJWT(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"name":    user.Name,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * 7 * time.Hour).Unix(), // 7 days
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) ValidateJWT(tokenString string) (*models.User, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(s.jwtSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		user := &models.User{
			ID:   claims["user_id"].(string),
			Name: claims["name"].(string),
			Role: claims["role"].(string),
		}
		return user, nil
	}

	return nil, fmt.Errorf("invalid token")
}
func (s *AuthService) GetClientID() string {
	return s.ClientID
}

func (s *AuthService) GetRedirectURI() string {
	return s.RedirectURI
}
