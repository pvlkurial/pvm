package services

import (
	"crypto/hmac"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"strings"
	"time"

	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/repositories"

	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

var (
	ErrPatreonNotConfigured    = errors.New("patreon is not configured")
	ErrPatreonInvalidState     = errors.New("invalid or expired patreon state")
	ErrPatreonAlreadyLinked    = errors.New("this patreon account is already connected to another profile")
	ErrPatreonInvalidSignature = errors.New("invalid patreon webhook signature")
)

const patreonStateTTL = 10 * time.Minute

type PatreonService interface {
	IsConfigured() bool
	AuthorizeURL(user *models.User) (string, error)
	Connect(user *models.User, code string, state string) (isSupporter bool, err error)
	Disconnect(user *models.User) error
	HandleWebhook(event string, signature string, body []byte) error
}

type patreonService struct {
	client         *clients.PatreonAPIClient
	userRepository repositories.UserRepository
	// stateKey signs the OAuth state. It is derived from, but not equal to, the
	// session key, so a state token can never pass as a login token.
	stateKey      []byte
	webhookSecret string
	campaignID    string
	// supporterTierIDs are the tiers that unlock supporter benefits. Empty
	// means any active pledge counts.
	supporterTierIDs map[string]bool
}

func NewPatreonService(client *clients.PatreonAPIClient, userRepository repositories.UserRepository, jwtSecret string) PatreonService {
	tierIDs := map[string]bool{}
	for _, id := range strings.Split(os.Getenv("PATREON_SUPPORTER_TIER_IDS"), ",") {
		if id = strings.TrimSpace(id); id != "" {
			tierIDs[id] = true
		}
	}

	return &patreonService{
		client:           client,
		userRepository:   userRepository,
		stateKey:         []byte(jwtSecret + ":patreon-state"),
		webhookSecret:    os.Getenv("PATREON_WEBHOOK_SECRET"),
		campaignID:       os.Getenv("PATREON_CAMPAIGN_ID"),
		supporterTierIDs: tierIDs,
	}
}

func (s *patreonService) IsConfigured() bool {
	return s.client.IsConfigured()
}

// AuthorizeURL builds the Patreon consent link. The state is signed and bound
// to the user, so a code can only be redeemed by the account that asked for it.
func (s *patreonService) AuthorizeURL(user *models.User) (string, error) {
	if !s.IsConfigured() {
		return "", ErrPatreonNotConfigured
	}

	state, err := s.stateFor(user)
	if err != nil {
		return "", err
	}

	return s.client.AuthorizeURL(state), nil
}

func (s *patreonService) stateFor(user *models.User) (string, error) {
	return jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(patreonStateTTL).Unix(),
	}).SignedString(s.stateKey)
}

func (s *patreonService) verifyState(state string, userID string) error {
	token, err := jwt.Parse(state, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return s.stateKey, nil
	})
	if err != nil || !token.Valid {
		return ErrPatreonInvalidState
	}

	subject, err := token.Claims.GetSubject()
	if err != nil || subject != userID {
		return ErrPatreonInvalidState
	}
	return nil
}

// Connect finishes the OAuth flow: it links the Patreon profile to the user and
// sets their supporter status from their current pledge.
func (s *patreonService) Connect(user *models.User, code string, state string) (bool, error) {
	if !s.IsConfigured() {
		return false, ErrPatreonNotConfigured
	}
	if err := s.verifyState(state, user.ID); err != nil {
		return false, err
	}

	accessToken, err := s.client.ExchangeCode(code)
	if err != nil {
		return false, err
	}

	identity, err := s.client.FetchIdentity(accessToken)
	if err != nil {
		return false, err
	}
	patreonUserID := identity.Data.ID
	if patreonUserID == "" {
		return false, fmt.Errorf("patreon identity has no user id")
	}

	linkedTo, err := s.userRepository.FindUserIDByPatreonID(patreonUserID)
	switch {
	case err == nil && linkedTo != user.ID:
		return false, ErrPatreonAlreadyLinked
	case err != nil && !errors.Is(err, gorm.ErrRecordNotFound):
		return false, err
	}

	isSupporter := false
	for _, member := range identity.Members() {
		if s.qualifies(member) {
			isSupporter = true
			break
		}
	}

	if err := s.userRepository.LinkPatreon(user.ID, patreonUserID, isSupporter); err != nil {
		// The unique index catches a race with another account linking the same profile.
		if errors.Is(err, gorm.ErrDuplicatedKey) || strings.Contains(err.Error(), "duplicate key") {
			return false, ErrPatreonAlreadyLinked
		}
		return false, err
	}

	slog.Info("patreon connected", "user_id", user.ID, "patreon_user_id", patreonUserID, "supporter", isSupporter)
	return isSupporter, nil
}

func (s *patreonService) Disconnect(user *models.User) error {
	return s.userRepository.UnlinkPatreon(user.ID)
}

// qualifies reports whether a membership unlocks supporter benefits: an active
// pledge to this campaign, on a supporter tier when those are configured.
func (s *patreonService) qualifies(member clients.PatreonResource) bool {
	status := member.Attributes.PatronStatus
	if status == nil || *status != "active_patron" {
		return false
	}

	if s.campaignID != "" {
		campaign := member.Relationships.Campaign.Data
		if campaign == nil || campaign.ID != s.campaignID {
			return false
		}
	}

	if len(s.supporterTierIDs) == 0 {
		return true
	}
	for _, tier := range member.Relationships.CurrentlyEntitledTiers.Data {
		if s.supporterTierIDs[tier.ID] {
			return true
		}
	}
	return false
}

// HandleWebhook keeps supporter status in sync as pledges start, change and
// end, so nobody has to reconnect. Patreon signs the raw body with HMAC-MD5.
func (s *patreonService) HandleWebhook(event string, signature string, body []byte) error {
	if s.webhookSecret == "" {
		return ErrPatreonNotConfigured
	}

	mac := hmac.New(md5.New, []byte(s.webhookSecret))
	mac.Write(body)
	expected := hex.EncodeToString(mac.Sum(nil))
	if !hmac.Equal([]byte(expected), []byte(strings.ToLower(signature))) {
		return ErrPatreonInvalidSignature
	}

	if !strings.HasPrefix(event, "members:") {
		return nil
	}

	var payload clients.PatreonDocument
	if err := json.Unmarshal(body, &payload); err != nil {
		return fmt.Errorf("decode patreon webhook: %w", err)
	}

	patron := payload.Data.Relationships.User.Data
	if patron == nil || patron.ID == "" {
		return nil
	}

	// A cancelled pledge stays entitled until the paid period ends, and Patreon
	// sends a members:update when it lapses, so only a deleted member is
	// dropped outright.
	isSupporter := event != "members:delete" && s.qualifies(payload.Data)

	slog.Info("patreon webhook", "event", event, "patreon_user_id", patron.ID, "supporter", isSupporter)
	return s.userRepository.SetPatreonSupporter(patron.ID, isSupporter)
}
