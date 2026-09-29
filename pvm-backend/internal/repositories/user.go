package repositories

import (
	"time"

	"example/pvm-backend/internal/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	SetSupporter(userID string, isSupporter bool) error
	ClaimRecordRefresh(userID string, cooldown time.Duration) (claimed bool, retryAfter time.Duration, err error)
	FindUserIDByPatreonID(patreonUserID string) (string, error)
	LinkPatreon(userID string, patreonUserID string, isSupporter bool) error
	UnlinkPatreon(userID string) error
	SetPatreonSupporter(patreonUserID string, isSupporter bool) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

// SetSupporter returns gorm.ErrRecordNotFound when there is no such user.
func (r *userRepository) SetSupporter(userID string, isSupporter bool) error {
	result := r.db.Model(&models.User{}).Where("id = ?", userID).Update("is_supporter", isSupporter)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// ClaimRecordRefresh records a refresh for the user if their last one is at
// least `cooldown` old. It is a single conditional UPDATE, so concurrent
// requests cannot both get through. When the claim fails, retryAfter says how
// long until the next one is allowed.
func (r *userRepository) ClaimRecordRefresh(userID string, cooldown time.Duration) (bool, time.Duration, error) {
	now := time.Now()
	result := r.db.Model(&models.User{}).
		Where("id = ? AND (last_record_refresh_at IS NULL OR last_record_refresh_at <= ?)", userID, now.Add(-cooldown)).
		Update("last_record_refresh_at", now)
	if result.Error != nil {
		return false, 0, result.Error
	}
	if result.RowsAffected == 1 {
		return true, 0, nil
	}

	user := models.User{}
	if err := r.db.Select("last_record_refresh_at").Where("id = ?", userID).First(&user).Error; err != nil {
		return false, 0, err
	}
	retryAfter := cooldown
	if user.LastRecordRefreshAt != nil {
		retryAfter = user.LastRecordRefreshAt.Add(cooldown).Sub(now)
	}
	return false, max(retryAfter, time.Second), nil
}

// FindUserIDByPatreonID returns gorm.ErrRecordNotFound when no account is
// linked to that Patreon profile.
func (r *userRepository) FindUserIDByPatreonID(patreonUserID string) (string, error) {
	user := models.User{}
	if err := r.db.Select("id").Where("patreon_user_id = ?", patreonUserID).First(&user).Error; err != nil {
		return "", err
	}
	return user.ID, nil
}

// LinkPatreon returns gorm.ErrRecordNotFound when there is no such user.
func (r *userRepository) LinkPatreon(userID string, patreonUserID string, isSupporter bool) error {
	result := r.db.Model(&models.User{}).Where("id = ?", userID).Updates(map[string]any{
		"patreon_user_id":   patreonUserID,
		"patreon_supporter": isSupporter,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *userRepository) UnlinkPatreon(userID string) error {
	return r.db.Model(&models.User{}).Where("id = ?", userID).Updates(map[string]any{
		"patreon_user_id":   nil,
		"patreon_supporter": false,
	}).Error
}

// SetPatreonSupporter updates whichever account is linked to the Patreon
// profile. A pledge from someone who never connected is simply a no-op.
func (r *userRepository) SetPatreonSupporter(patreonUserID string, isSupporter bool) error {
	return r.db.Model(&models.User{}).Where("patreon_user_id = ?", patreonUserID).
		Update("patreon_supporter", isSupporter).Error
}
