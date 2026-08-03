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

		// The token carries the role it was issued with, which goes stale as soon as
		// a superadmin changes it. Prefer the persisted user so promotions and
		// demotions apply on the very next request.
		if current, err := authService.GetUserByID(user.ID); err == nil {
			user = current
		}

		ctx.Set("user", user)
		ctx.Next()
	}
}

func AdminOnly() gin.HandlerFunc {
	return RequireRole(models.RoleAdmin)
}

// RequireRole rejects users below minRole in the user -> admin -> superadmin
// hierarchy. It must be chained after AuthMiddleware, which populates "user".
func RequireRole(minRole string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		user, ok := userFromContext(ctx)
		if !ok {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
			ctx.Abort()
			return
		}

		if !user.HasAtLeastRole(minRole) {
			ctx.JSON(http.StatusForbidden, gin.H{"error": minRole + " role required"})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}

// RequireMappackPermission gates a route on the caller being able to manage the
// mappack named by the :mappack_id path parameter. Superadmins always pass.
func RequireMappackPermission(permissionService services.PermissionService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		user, ok := userFromContext(ctx)
		if !ok {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
			ctx.Abort()
			return
		}

		mappackID := ctx.Param("mappack_id")
		if mappackID == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Missing mappack id"})
			ctx.Abort()
			return
		}

		allowed, err := permissionService.CanManageMappack(user, mappackID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check permissions"})
			ctx.Abort()
			return
		}
		if !allowed {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to manage this mappack"})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}

func userFromContext(ctx *gin.Context) (*models.User, bool) {
	value, exists := ctx.Get("user")
	if !exists {
		return nil, false
	}
	user, ok := value.(*models.User)
	return user, ok
}
