package middleware

import (
	"net/http"
	"strings"

	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/services"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "No authorization header"})
			ctx.Abort()
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

		user, err := authService.ValidateJWT(tokenString)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			ctx.Abort()
			return
		}

		ctx.Set("user", user)
		ctx.Next()
	}
}

func AdminOnly() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		user, exists := ctx.Get("user")
		if !exists {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
			ctx.Abort()
			return
		}

		if user.(*models.User).Role != "admin" {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "Admin only"})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}
