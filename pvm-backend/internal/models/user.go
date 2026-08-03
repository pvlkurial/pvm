package models

import "time"

const (
	RoleUser       = "user"
	RoleAdmin      = "admin"
	RoleSuperAdmin = "superadmin"
	RolePlugin     = "plugin"
)

// roleRank orders the site roles. Roles outside this map (plugin) are not part
// of the hierarchy and never satisfy a minimum-role check.
var roleRank = map[string]int{
	RoleUser:       1,
	RoleAdmin:      2,
	RoleSuperAdmin: 3,
}

// IsAssignableRole reports whether a role may be handed out through the admin panel.
func IsAssignableRole(role string) bool {
	_, ok := roleRank[role]
	return ok
}

type User struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Role      string    `gorm:"default:user" json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// HasAtLeastRole reports whether the user meets or exceeds minRole in the
// user -> admin -> superadmin hierarchy.
func (u *User) HasAtLeastRole(minRole string) bool {
	have, ok := roleRank[u.Role]
	if !ok {
		return false
	}
	want, ok := roleRank[minRole]
	if !ok {
		return false
	}
	return have >= want
}

func (u *User) IsSuperAdmin() bool {
	return u.Role == RoleSuperAdmin
}
