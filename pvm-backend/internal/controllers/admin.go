package controllers

import (
	"errors"
	"net/http"
	"strconv"

	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AdminController struct {
	permissionService services.PermissionService
	mappackService    services.MappackService
}

func NewAdminController(permissionService services.PermissionService, mappackService services.MappackService) *AdminController {
	return &AdminController{permissionService: permissionService, mappackService: mappackService}
}

type userWithPermissionsResponse struct {
	models.User
	MappackIDs []string `json:"mappack_ids"`
}

// ListUsers returns every user together with the mappacks each one may manage.
func (t *AdminController) ListUsers(c *gin.Context) {
	users, err := t.permissionService.ListUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := make([]userWithPermissionsResponse, 0, len(users))
	for _, user := range users {
		mappackIDs := []string{}
		if user.Role == models.RoleAdmin {
			mappackIDs, err = t.permissionService.ListMappackIDsForUser(user.ID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		}
		response = append(response, userWithPermissionsResponse{User: user, MappackIDs: mappackIDs})
	}

	c.JSON(http.StatusOK, response)
}

// SearchPlayers backs the role-assignment picker: any known player can be given
// a role, whether or not they have ever signed in.
func (t *AdminController) SearchPlayers(c *gin.Context) {
	query := c.Query("q")

	limit, err := strconv.Atoi(c.DefaultQuery("limit", "25"))
	if err != nil {
		limit = 25
	}

	players, err := t.permissionService.SearchPlayers(query, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, players)
}

type updateRoleRequest struct {
	Role string `json:"role"`
}

func (t *AdminController) UpdateUserRole(c *gin.Context) {
	userID := c.Param("user_id")

	var request updateRoleRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload: " + err.Error()})
		return
	}

	err := t.permissionService.SetUserRole(userID, request.Role)
	switch {
	case err == nil:
		c.JSON(http.StatusOK, gin.H{"user_id": userID, "role": request.Role})
	case errors.Is(err, services.ErrInvalidRole):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	case errors.Is(err, services.ErrLastSuperAdmin):
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
	case errors.Is(err, gorm.ErrRecordNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": "No such player or user"})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func (t *AdminController) GetUserPermissions(c *gin.Context) {
	userID := c.Param("user_id")

	mappackIDs, err := t.permissionService.ListMappackIDsForUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user_id": userID, "mappack_ids": mappackIDs})
}

type setPermissionsRequest struct {
	MappackIDs []string `json:"mappack_ids"`
}

// SetUserPermissions replaces an admin's grants with exactly the ids supplied.
func (t *AdminController) SetUserPermissions(c *gin.Context) {
	userID := c.Param("user_id")

	var request setPermissionsRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload: " + err.Error()})
		return
	}

	actor, _ := currentUser(c)
	grantedBy := ""
	if actor != nil {
		grantedBy = actor.ID
	}

	err := t.permissionService.SetUserPermissions(userID, request.MappackIDs, grantedBy)
	switch {
	case err == nil:
		c.JSON(http.StatusOK, gin.H{"user_id": userID, "mappack_ids": request.MappackIDs})
	case errors.Is(err, services.ErrNotAnAdmin), errors.Is(err, services.ErrUnknownMappacks):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

// ListManageableMappacks powers the permission picker: every mappack, unfiltered.
func (t *AdminController) ListManageableMappacks(c *gin.Context) {
	mappacks, err := t.mappackService.GetAllUnfiltered()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, mappacks)
}

// GetMyPermissions tells the signed-in user what they may manage, so the UI can
// render the right affordances without guessing at the role rules.
func (t *AdminController) GetMyPermissions(c *gin.Context) {
	user, ok := currentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
		return
	}

	mappackIDs := []string{}
	if user.Role == models.RoleAdmin {
		var err error
		mappackIDs, err = t.permissionService.ListMappackIDsForUser(user.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"role":               user.Role,
		"can_create_mappack": t.permissionService.CanCreateMappack(user),
		"manages_all":        user.IsSuperAdmin(),
		"mappack_ids":        mappackIDs,
	})
}

func currentUser(c *gin.Context) (*models.User, bool) {
	value, exists := c.Get("user")
	if !exists {
		return nil, false
	}
	user, ok := value.(*models.User)
	return user, ok
}
