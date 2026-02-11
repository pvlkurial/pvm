export interface User {
  id: string;
  name: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  token: string;
  user_id: string;
  name: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}