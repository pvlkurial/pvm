package controllers

import (
	"errors"
	"io"
	"log/slog"
	"net/http"

	"example/pvm-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type PatreonController struct {
	patreonService services.PatreonService
}

func NewPatreonController(patreonService services.PatreonService) *PatreonController {
	return &PatreonController{patreonService: patreonService}
}

// Connect returns the Patreon consent link for the signed-in user.
func (t *PatreonController) Connect(c *gin.Context) {
	user, ok := currentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
		return
	}

	authURL, err := t.patreonService.AuthorizeURL(user)
	switch {
	case err == nil:
		c.JSON(http.StatusOK, gin.H{"auth_url": authURL})
	case errors.Is(err, services.ErrPatreonNotConfigured):
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Patreon connection is not available"})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

type patreonCallbackRequest struct {
	Code  string `json:"code" binding:"required"`
	State string `json:"state" binding:"required"`
}

// Callback redeems the code Patreon redirected back with and links the profile.
func (t *PatreonController) Callback(c *gin.Context) {
	user, ok := currentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
		return
	}

	var request patreonCallbackRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload: " + err.Error()})
		return
	}

	isSupporter, err := t.patreonService.Connect(user, request.Code, request.State)
	switch {
	case err == nil:
		c.JSON(http.StatusOK, gin.H{"patreon_supporter": isSupporter})
	case errors.Is(err, services.ErrPatreonInvalidState):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	case errors.Is(err, services.ErrPatreonAlreadyLinked):
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
	case errors.Is(err, services.ErrPatreonNotConfigured):
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Patreon connection is not available"})
	default:
		slog.Error("patreon connect failed", "user_id", user.ID, "error", err)
		c.JSON(http.StatusBadGateway, gin.H{"error": "Failed to connect Patreon"})
	}
}

func (t *PatreonController) Disconnect(c *gin.Context) {
	user, ok := currentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
		return
	}

	if err := t.patreonService.Disconnect(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// Webhook receives member events from Patreon. See PatreonService.HandleWebhook.
func (t *PatreonController) Webhook(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unreadable body"})
		return
	}

	err = t.patreonService.HandleWebhook(c.GetHeader("X-Patreon-Event"), c.GetHeader("X-Patreon-Signature"), body)
	switch {
	case err == nil:
		c.Status(http.StatusNoContent)
	case errors.Is(err, services.ErrPatreonInvalidSignature):
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
	case errors.Is(err, services.ErrPatreonNotConfigured):
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
	default:
		slog.Error("patreon webhook failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process webhook"})
	}
}
