import { AuthResponse, Role, User } from "@/types/auth";
import { API_BASE } from "@/constants/miscellaneous";

/** Error carrying the HTTP status, so callers can tell 401 from a network fault. */
export class AuthRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** Reads `exp` out of a JWT payload without verifying it. Returns ms, or null. */
function readTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

export const authService = {
  async getAuthUrl(): Promise<string> {
    const response = await fetch(`${API_BASE}/auth/login`);
    const data = await response.json();
    return data.auth_url;
  },

  async handleCallback(code: string, state: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        state,
        redirect_uri: `${window.location.origin}/auth/callback`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Authentication failed");
    }

    return response.json();
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new AuthRequestError("Failed to get user", response.status);
    }

    return response.json();
  },

  /** Trades a still-valid token for a fresh one, extending the session. */
  async refreshToken(token: string): Promise<string> {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new AuthRequestError("Failed to refresh token", response.status);
    }

    const data = await response.json();
    return data.token;
  },

  isTokenExpired(token: string): boolean {
    const expiry = readTokenExpiry(token);
    // A token we cannot read is left alone; the server is the real authority.
    return expiry !== null && expiry <= Date.now();
  },

  /** True once the token is past half its life, so it can slide forward early. */
  shouldRefreshToken(token: string): boolean {
    const expiry = readTokenExpiry(token);
    if (expiry === null) return false;
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    return expiry - Date.now() < SEVEN_DAYS / 2;
  },

  saveToken(token: string): void {
    localStorage.setItem("auth_token", token);
  },

  saveAuth(authData: AuthResponse): void {
    localStorage.setItem("auth_token", authData.token);
    localStorage.setItem("user_id", authData.user_id);
    localStorage.setItem("user_name", authData.name);
    localStorage.setItem("user_role", authData.role);
  },

  /** Refreshes the cached identity after a server-side role change. */
  updateCachedUser(user: User): void {
    localStorage.setItem("user_id", user.id);
    localStorage.setItem("user_name", user.name);
    localStorage.setItem("user_role", user.role);
  },

  loadAuth(): { token: string; user: User } | null {
    const token = localStorage.getItem("auth_token");
    const user_id = localStorage.getItem("user_id");
    const name = localStorage.getItem("user_name");
    const role = localStorage.getItem("user_role");

    if (token && user_id && name && role) {
      // An expired token would otherwise leave the UI looking signed in while
      // every authenticated request quietly fails.
      if (this.isTokenExpired(token)) {
        this.logout();
        return null;
      }

      return {
        token,
        user: {
          id: user_id,
          name,
          role: role as Role,
        },
      };
    }

    return null;
  },

  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
  },
};
