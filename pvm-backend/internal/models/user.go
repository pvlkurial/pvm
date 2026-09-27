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
	ID   string `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
	Role string `gorm:"default:user" json:"role"`
	// IsSupporter marks a Patreon supporter on the tier that unlocks refreshing
	// your own records on demand. Set by a superadmin.
	IsSupporter bool `gorm:"not null;default:false" json:"is_supporter"`
	// LastRecordRefreshAt rate-limits on-demand record refreshes; see
	// UserRepository.ClaimRecordRefresh.
	LastRecordRefreshAt *time.Time `json:"-"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
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

// CanRefreshRecords reports whether the user may pull their own record for a
// track from Nadeo on demand: superadmins and supporters.
func (u *User) CanRefreshRecords() bool {
	return u.IsSuperAdmin() || u.IsSupporter
}
