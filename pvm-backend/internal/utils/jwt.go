package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"
)

type PVMClaims struct {
	AccountID   string `json:"account_id"`
	DisplayName string `json:"display_name"`
	Exp         int64  `json:"exp"`
}

func IssuePVMToken(accountID, displayName string) (string, error) {
	header := base64.RawURLEncoding.EncodeToString([]byte(`{"alg":"HS256","typ":"JWT"}`))

	claims := PVMClaims{
		AccountID:   accountID,
		DisplayName: displayName,
		Exp:         time.Now().Add(30 * 24 * time.Hour).Unix(), // 30 days
	}
	claimsJSON, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}
	payload := base64.RawURLEncoding.EncodeToString(claimsJSON)

	sig := signHS256(header+"."+payload, os.Getenv("PVM_JWT_SECRET"))
	return header + "." + payload + "." + sig, nil
}

func VerifyPVMToken(token string) (*PVMClaims, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("invalid token format")
	}

	expected := signHS256(parts[0]+"."+parts[1], os.Getenv("PVM_JWT_SECRET"))
	if !hmac.Equal([]byte(expected), []byte(parts[2])) {
		return nil, fmt.Errorf("invalid signature")
	}

	payload, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, fmt.Errorf("decode payload: %w", err)
	}

	var claims PVMClaims
	if err := json.Unmarshal(payload, &claims); err != nil {
		return nil, fmt.Errorf("unmarshal claims: %w", err)
	}

	if time.Now().Unix() > claims.Exp {
		return nil, fmt.Errorf("token expired")
	}

	return &claims, nil
}

func signHS256(data, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(data))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}
