package repositories

import (
	"errors"

	"example/pvm-backend/internal/models"

	"gorm.io/gorm"
)

type PermissionRepository interface {
	GetUser(id string) (models.User, error)
	ListUsers() ([]models.User, error)
	ListUsersByRole(roles ...string) ([]models.User, error)
	CountByRole(role string) (int64, error)
	UpdateUserRole(id string, role string) error

	SearchPlayersWithRoles(query string, limit int) ([]PlayerWithRole, error)
	EnsureUserFromPlayer(playerID string) (models.User, error)

	HasPermission(userID string, mappackID string) (bool, error)
	ListPermissionsForUser(userID string) ([]models.MappackPermission, error)
	ListMappackIDsForUser(userID string) ([]string, error)
	ReplacePermissionsForUser(userID string, mappackIDs []string, grantedBy string) error
	DeletePermissionsForUser(userID string) error
}

// PlayerWithRole is a known player alongside the site role they hold. Players
// who have never signed in have no users row and come back as the default role.
type PlayerWithRole struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Role     string `json:"role"`
	HasLogin bool   `json:"has_login"`
}

type permissionRepository struct {
	db *gorm.DB
}

func NewPermissionRepository(db *gorm.DB) PermissionRepository {
	return &permissionRepository{db: db}
}

func (r *permissionRepository) GetUser(id string) (models.User, error) {
	user := models.User{}
	err := r.db.Where("id = ?", id).First(&user).Error
	return user, err
}

func (r *permissionRepository) ListUsers() ([]models.User, error) {
	users := []models.User{}
	err := r.db.Order("role DESC").Order("name ASC").Find(&users).Error
	return users, err
}

func (r *permissionRepository) ListUsersByRole(roles ...string) ([]models.User, error) {
	users := []models.User{}
	err := r.db.Where("role IN ?", roles).Order("name ASC").Find(&users).Error
	return users, err
}

func (r *permissionRepository) CountByRole(role string) (int64, error) {
	var count int64
	err := r.db.Model(&models.User{}).Where("role = ?", role).Count(&count).Error
	return count, err
}

func (r *permissionRepository) UpdateUserRole(id string, role string) error {
	return r.db.Model(&models.User{}).Where("id = ?", id).Update("role", role).Error
}

// SearchPlayersWithRoles finds players by name, preferring prefix matches, and
// reports the role each one currently holds.
func (r *permissionRepository) SearchPlayersWithRoles(query string, limit int) ([]PlayerWithRole, error) {
	results := []PlayerWithRole{}
	err := r.db.Raw(`
    SELECT
      p.id::text        AS id,
      p.name            AS name,
      COALESCE(u.role, ?) AS role,
      (u.id IS NOT NULL)  AS has_login
    FROM players p
    LEFT JOIN users u ON u.id = p.id::text
    WHERE p.name ILIKE ?
    ORDER BY
      CASE WHEN p.name ILIKE ? THEN 0 ELSE 1 END,
      p.name ASC
    LIMIT ?
  `, models.RoleUser, "%"+query+"%", query+"%", limit).Scan(&results).Error
	return results, err
}

// EnsureUserFromPlayer returns the users row for a player, creating one from the
// player record if they have never signed in. This lets a role be assigned ahead
// of first login; CreateOrUpdateUser preserves the role when they do log in.
func (r *permissionRepository) EnsureUserFromPlayer(playerID string) (models.User, error) {
	user := models.User{}
	err := r.db.Where("id = ?", playerID).First(&user).Error
	if err == nil {
		return user, nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return user, err
	}

	player := models.Player{}
	if err := r.db.Where("id = ?", playerID).First(&player).Error; err != nil {
		return user, err
	}

	user = models.User{ID: player.ID, Name: player.Name, Role: models.RoleUser}
	if err := r.db.Create(&user).Error; err != nil {
		return user, err
	}
	return user, nil
}

func (r *permissionRepository) HasPermission(userID string, mappackID string) (bool, error) {
	var count int64
	err := r.db.Model(&models.MappackPermission{}).
		Where("user_id = ? AND mappack_id = ?", userID, mappackID).
		Count(&count).Error
	return count > 0, err
}

func (r *permissionRepository) ListPermissionsForUser(userID string) ([]models.MappackPermission, error) {
	permissions := []models.MappackPermission{}
	err := r.db.Where("user_id = ?", userID).Find(&permissions).Error
	return permissions, err
}

func (r *permissionRepository) ListMappackIDsForUser(userID string) ([]string, error) {
	ids := []string{}
	err := r.db.Model(&models.MappackPermission{}).
		Where("user_id = ?", userID).
		Order("mappack_id ASC").
		Pluck("mappack_id", &ids).Error
	return ids, err
}

// ReplacePermissionsForUser makes the user's grants exactly mappackIDs.
func (r *permissionRepository) ReplacePermissionsForUser(userID string, mappackIDs []string, grantedBy string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("user_id = ?", userID).Delete(&models.MappackPermission{}).Error; err != nil {
			return err
		}

		if len(mappackIDs) == 0 {
			return nil
		}

		permissions := make([]models.MappackPermission, 0, len(mappackIDs))
		for _, mappackID := range mappackIDs {
			permissions = append(permissions, models.MappackPermission{
				UserID:    userID,
				MappackID: mappackID,
				GrantedBy: grantedBy,
			})
		}
		return tx.Create(&permissions).Error
	})
}

func (r *permissionRepository) DeletePermissionsForUser(userID string) error {
	return r.db.Where("user_id = ?", userID).Delete(&models.MappackPermission{}).Error
}
