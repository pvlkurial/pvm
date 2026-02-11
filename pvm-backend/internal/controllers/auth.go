package controllers

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/http"
	"net/url"

	"example/pvm-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService *services.AuthService
}

func NewAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

// Generate random state for CSRF protection
func generateState() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

// GET /auth/login - Return OAuth URL
func (c *AuthController) Login(ctx *gin.Context) {
	state := generateState()

	// Store state in session/cookie for verification (optional but recommended)
	ctx.SetCookie("oauth_state", state, 300, "/", "", false, true)

	params := url.Values{}
	params.Add("response_type", "code")
	params.Add("client_id", c.authService.GetClientID())
	params.Add("redirect_uri", c.authService.GetRedirectURI())
	params.Add("state", state)
	// Omit scope for basic user info, or add specific scopes if needed:
	// params.Add("scope", "clubs read_favorite write_favorite")

	authURL := fmt.Sprintf("https://api.trackmania.com/oauth/authorize?%s", params.Encode())

	ctx.JSON(http.StatusOK, gin.H{"auth_url": authURL})
}

// POST /auth/callback - Handle OAuth callback
func (c *AuthController) Callback(ctx *gin.Context) {
	var req struct {
		Code        string `json:"code" binding:"required"`
		State       string `json:"state"`
		RedirectURI string `json:"redirect_uri"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Optional: Verify state for CSRF protection
	// savedState, _ := ctx.Cookie("oauth_state")
	// if req.State != savedState {
	//     ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid state parameter"})
	//     return
	// }

	// Exchange code for token
	tokenResp, err := c.authService.ExchangeCodeForToken(req.Code, req.RedirectURI)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token", "details": err.Error()})
		return
	}

	// Get user info from Trackmania
	tmUser, err := c.authService.GetTrackmaniaUser(tokenResp.AccessToken)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info", "details": err.Error()})
		return
	}

	// Create or update user in our DB
	user, err := c.authService.CreateOrUpdateUser(tmUser)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user", "details": err.Error()})
		return
	}

	// Generate our own JWT
	jwt, err := c.authService.GenerateJWT(user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"token":   jwt,
		"user_id": user.ID,
		"name":    user.Name,
		"role":    user.Role,
	})
}

// GET /auth/me - Get current user
func (c *AuthController) Me(ctx *gin.Context) {
	user, exists := ctx.Get("user")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
		return
	}

	ctx.JSON(http.StatusOK, user)
}
