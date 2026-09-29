package services

import (
	"crypto/hmac"
	"crypto/md5"
	"encoding/hex"
	"errors"
	"testing"

	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/repositories"
)

// fakeUserRepository records the webhook's supporter updates.
type fakeUserRepository struct {
	repositories.UserRepository
	updates map[string]bool
}

func (r *fakeUserRepository) SetPatreonSupporter(patreonUserID string, isSupporter bool) error {
	r.updates[patreonUserID] = isSupporter
	return nil
}

func newTestPatreonService(tierIDs ...string) (*patreonService, *fakeUserRepository) {
	repo := &fakeUserRepository{updates: map[string]bool{}}
	tiers := map[string]bool{}
	for _, id := range tierIDs {
		tiers[id] = true
	}
	return &patreonService{
		userRepository:   repo,
		stateKey:         []byte("secret:patreon-state"),
		webhookSecret:    "hook-secret",
		campaignID:       "camp1",
		supporterTierIDs: tiers,
	}, repo
}

func sign(body string) string {
	mac := hmac.New(md5.New, []byte("hook-secret"))
	mac.Write([]byte(body))
	return hex.EncodeToString(mac.Sum(nil))
}

func memberPayload(status string, tierID string) string {
	return `{"data":{"id":"m1","type":"member","attributes":{"patron_status":"` + status + `"},
		"relationships":{"campaign":{"data":{"id":"camp1","type":"campaign"}},
		"currently_entitled_tiers":{"data":[{"id":"` + tierID + `","type":"tier"}]},
		"user":{"data":{"id":"p1","type":"user"}}}}}`
}

func TestPatreonWebhook(t *testing.T) {
	cases := []struct {
		name  string
		event string
		body  string
		tiers []string
		want  bool
	}{
		{"active on supporter tier", "members:pledge:create", memberPayload("active_patron", "t1"), []string{"t1"}, true},
		{"active on another tier", "members:update", memberPayload("active_patron", "t2"), []string{"t1"}, false},
		{"any tier when none configured", "members:update", memberPayload("active_patron", "t2"), nil, true},
		{"declined payment", "members:update", memberPayload("declined_patron", "t1"), []string{"t1"}, false},
		{"member deleted", "members:delete", memberPayload("active_patron", "t1"), []string{"t1"}, false},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			service, repo := newTestPatreonService(tc.tiers...)
			if err := service.HandleWebhook(tc.event, sign(tc.body), []byte(tc.body)); err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			got, ok := repo.updates["p1"]
			if !ok || got != tc.want {
				t.Fatalf("supporter = %v (updated %v), want %v", got, ok, tc.want)
			}
		})
	}
}

func TestPatreonWebhookRejectsBadSignature(t *testing.T) {
	service, repo := newTestPatreonService()
	body := memberPayload("active_patron", "t1")

	err := service.HandleWebhook("members:update", sign(body+"x"), []byte(body))
	if !errors.Is(err, ErrPatreonInvalidSignature) {
		t.Fatalf("err = %v, want ErrPatreonInvalidSignature", err)
	}
	if len(repo.updates) != 0 {
		t.Fatalf("updated %v despite bad signature", repo.updates)
	}
}

func TestPatreonStateIsBoundToUser(t *testing.T) {
	service, _ := newTestPatreonService()

	state, err := service.stateFor(&models.User{ID: "user-a"})
	if err != nil {
		t.Fatal(err)
	}
	if err := service.verifyState(state, "user-a"); err != nil {
		t.Fatalf("own state rejected: %v", err)
	}
	if err := service.verifyState(state, "user-b"); !errors.Is(err, ErrPatreonInvalidState) {
		t.Fatalf("another user's state accepted: %v", err)
	}
}
