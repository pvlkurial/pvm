package services

import (
	"errors"
	"fmt"

	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/repositories"
)

var (
	ErrInvalidRole     = errors.New("invalid role")
	ErrLastSuperAdmin  = errors.New("cannot demote the last superadmin")
	ErrNotAnAdmin      = errors.New("mappack permissions can only be granted to admins")
	ErrUnknownMappacks = errors.New("one or more mappacks do not exist")
)

type PermissionService interface {
	CanManageMappack(user *models.User, mappackID string) (bool, error)
	CanCreateMappack(user *models.User) bool

	ListUsers() ([]models.User, error)
	SearchPlayers(query string, limit int) ([]repositories.PlayerWithRole, error)
	SetUserRole(userID string, role string) error

	ListMappackIDsForUser(userID string) ([]string, error)
	SetUserPermissions(userID string, mappackIDs []string, grantedBy string) error
}

type permissionService struct {
	permissionRepository repositories.PermissionRepository
	mappackRepository    repositories.MappackRepository
}

func NewPermissionService(permissionRepo repositories.PermissionRepository, mappackRepo repositories.MappackRepository) PermissionService {
	return &permissionService{permissionRepository: permissionRepo, mappackRepository: mappackRepo}
}

// CanManageMappack reports whether the user may edit the given mappack.
// Superadmins manage everything; admins need an explicit grant.
func (s *permissionService) CanManageMappack(user *models.User, mappackID string) (bool, error) {
	if user == nil {
		return false, nil
	}
	if user.IsSuperAdmin() {
		return true, nil
	}
	if user.Role != models.RoleAdmin {
		return false, nil
	}
	return s.permissionRepository.HasPermission(user.ID, mappackID)
}

// CanCreateMappack is superadmin-only: admins are scoped to mappacks granted to them.
func (s *permissionService) CanCreateMappack(user *models.User) bool {
	return user != nil && user.IsSuperAdmin()
}

func (s *permissionService) ListUsers() ([]models.User, error) {
	return s.permissionRepository.ListUsers()
}

const (
	defaultPlayerSearchLimit = 25
	maxPlayerSearchLimit     = 100
)

func (s *permissionService) SearchPlayers(query string, limit int) ([]repositories.PlayerWithRole, error) {
	if limit <= 0 {
		limit = defaultPlayerSearchLimit
	}
	if limit > maxPlayerSearchLimit {
		limit = maxPlayerSearchLimit
	}
	return s.permissionRepository.SearchPlayersWithRoles(query, limit)
}

func (s *permissionService) SetUserRole(userID string, role string) error {
	if !models.IsAssignableRole(role) {
		return fmt.Errorf("%w: %q", ErrInvalidRole, role)
	}

	// A role may be assigned to any known player, including one who has never
	// signed in, so materialise the users row on demand.
	current, err := s.permissionRepository.EnsureUserFromPlayer(userID)
	if err != nil {
		return err
	}

	if current.Role == role {
		return nil
	}

	// Refuse to remove the last superadmin, which would lock everyone out of the panel.
	if current.Role == models.RoleSuperAdmin {
		superAdmins, err := s.permissionRepository.CountByRole(models.RoleSuperAdmin)
		if err != nil {
			return err
		}
		if superAdmins <= 1 {
			return ErrLastSuperAdmin
		}
	}

	if err := s.permissionRepository.UpdateUserRole(userID, role); err != nil {
		return err
	}

	// Grants are meaningless for plain users, so drop them rather than leave them
	// to silently reactivate if the account is promoted again later.
	if role == models.RoleUser {
		return s.permissionRepository.DeletePermissionsForUser(userID)
	}
	return nil
}

func (s *permissionService) ListMappackIDsForUser(userID string) ([]string, error) {
	return s.permissionRepository.ListMappackIDsForUser(userID)
}

func (s *permissionService) SetUserPermissions(userID string, mappackIDs []string, grantedBy string) error {
	target, err := s.permissionRepository.GetUser(userID)
	if err != nil {
		return err
	}

	// Superadmins already have everything and plain users may hold nothing, so a
	// grant list only makes sense for admins.
	if target.Role != models.RoleAdmin {
		return fmt.Errorf("%w (user %q is %q)", ErrNotAnAdmin, target.Name, target.Role)
	}

	deduped, err := s.validateMappackIDs(mappackIDs)
	if err != nil {
		return err
	}

	return s.permissionRepository.ReplacePermissionsForUser(userID, deduped, grantedBy)
}

// validateMappackIDs drops duplicates and rejects ids that do not exist, so a typo
// cannot create a grant that silently matches nothing.
func (s *permissionService) validateMappackIDs(mappackIDs []string) ([]string, error) {
	if len(mappackIDs) == 0 {
		return nil, nil
	}

	mappacks, err := s.mappackRepository.GetAllUnfiltered()
	if err != nil {
		return nil, err
	}

	known := make(map[string]bool, len(mappacks))
	for _, mappack := range mappacks {
		known[mappack.ID] = true
	}

	seen := make(map[string]bool, len(mappackIDs))
	deduped := make([]string, 0, len(mappackIDs))
	unknown := []string{}
	for _, id := range mappackIDs {
		if seen[id] {
			continue
		}
		seen[id] = true
		if !known[id] {
			unknown = append(unknown, id)
			continue
		}
		deduped = append(deduped, id)
	}

	if len(unknown) > 0 {
		return nil, fmt.Errorf("%w: %v", ErrUnknownMappacks, unknown)
	}
	return deduped, nil
}
