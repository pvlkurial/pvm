package middleware

import (
	"example/pvm-backend/internal/services"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func PluginAuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
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

		if user.Role != "plugin" {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "Plugin token required"})
			ctx.Abort()
			return
		}

		ctx.Set("user", user)
		ctx.Next()
	}
}
