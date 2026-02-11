import { AuthResponse, User } from "@/types/auth";

const API_BASE = "http://localhost:8080";

export const authService = {
  // Get OAuth URL from backend
  async getAuthUrl(): Promise<string> {
    const response = await fetch(`${API_BASE}/auth/login`);
    const data = await response.json();
    return data.auth_url;
  },

  // Exchange code for JWT token
  async handleCallback(code: string, state: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        code,
        state,
        redirect_uri: "http://localhost:3000/auth/callback"
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Authentication failed");
    }

    return response.json();
  },

  // Get current user
  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user");
    }

    return response.json();
  },

  // Store auth data in localStorage
  saveAuth(authData: AuthResponse): void {
    localStorage.setItem("auth_token", authData.token);
    localStorage.setItem("user_id", authData.user_id);
    localStorage.setItem("user_name", authData.name);
    localStorage.setItem("user_role", authData.role);
  },

  // Load auth data from localStorage
  loadAuth(): { token: string; user: User } | null {
    const token = localStorage.getItem("auth_token");
    const user_id = localStorage.getItem("user_id");
    const name = localStorage.getItem("user_name");
    const role = localStorage.getItem("user_role");

    if (token && user_id && name && role) {
      return {
        token,
        user: {
          id: user_id,
          name,
          role: role as "user" | "admin",
        },
      };
    }

    return null;
  },

  // Clear auth data
  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
  },
};