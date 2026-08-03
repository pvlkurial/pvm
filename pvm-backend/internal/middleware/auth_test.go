package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"example/pvm-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

// newGuardedRouter builds a router whose handler is reachable only through
// RequireRole, registering the route on the group so the middleware applies.
func newGuardedRouter(minRole string, user *models.User) *gin.Engine {
	router := gin.New()

	group := router.Group("/guarded")
	if user != nil {
		group.Use(func(ctx *gin.Context) {
			ctx.Set("user", user)
			ctx.Next()
		})
	}
	group.Use(RequireRole(minRole))
	group.GET("/resource", func(ctx *gin.Context) {
		ctx.String(http.StatusOK, "reached")
	})

	return router
}

func TestRequireRole(t *testing.T) {
	cases := []struct {
		name     string
		minRole  string
		user     *models.User
		wantCode int
	}{
		{"anonymous is rejected", models.RoleAdmin, nil, http.StatusUnauthorized},
		{"user cannot reach admin", models.RoleAdmin, &models.User{Role: models.RoleUser}, http.StatusForbidden},
		{"admin reaches admin", models.RoleAdmin, &models.User{Role: models.RoleAdmin}, http.StatusOK},
		{"superadmin reaches admin", models.RoleAdmin, &models.User{Role: models.RoleSuperAdmin}, http.StatusOK},
		{"admin cannot reach superadmin", models.RoleSuperAdmin, &models.User{Role: models.RoleAdmin}, http.StatusForbidden},
		{"superadmin reaches superadmin", models.RoleSuperAdmin, &models.User{Role: models.RoleSuperAdmin}, http.StatusOK},
		{"plugin is outside the hierarchy", models.RoleAdmin, &models.User{Role: models.RolePlugin}, http.StatusForbidden},
		{"unknown role is rejected", models.RoleAdmin, &models.User{Role: "wizard"}, http.StatusForbidden},
	}

	for _, testCase := range cases {
		t.Run(testCase.name, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			request := httptest.NewRequest(http.MethodGet, "/guarded/resource", nil)

			newGuardedRouter(testCase.minRole, testCase.user).ServeHTTP(recorder, request)

			if recorder.Code != testCase.wantCode {
				t.Fatalf("got status %d, want %d (body: %s)", recorder.Code, testCase.wantCode, recorder.Body.String())
			}
		})
	}
}

func TestHasAtLeastRole(t *testing.T) {
	cases := []struct {
		role    string
		minRole string
		want    bool
	}{
		{models.RoleUser, models.RoleUser, true},
		{models.RoleUser, models.RoleAdmin, false},
		{models.RoleAdmin, models.RoleUser, true},
		{models.RoleAdmin, models.RoleSuperAdmin, false},
		{models.RoleSuperAdmin, models.RoleAdmin, true},
		{models.RolePlugin, models.RoleUser, false},
		{"", models.RoleUser, false},
	}

	for _, testCase := range cases {
		user := models.User{Role: testCase.role}
		if got := user.HasAtLeastRole(testCase.minRole); got != testCase.want {
			t.Errorf("User{Role:%q}.HasAtLeastRole(%q) = %v, want %v",
				testCase.role, testCase.minRole, got, testCase.want)
		}
	}
}
