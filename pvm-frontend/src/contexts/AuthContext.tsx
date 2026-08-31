"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState } from "@/types/auth";
import { authService, AuthRequestError } from "@/services/authService";

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const clearSession = () => {
    authService.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  useEffect(() => {
    const savedAuth = authService.loadAuth();

    if (!savedAuth) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    setState({
      user: savedAuth.user,
      token: savedAuth.token,
      isAuthenticated: true,
      isLoading: false,
    });

    let cancelled = false;

    const sync = async () => {
      let token = savedAuth.token;

      // Slide the session forward well before it lapses, so an active user is
      // never dropped mid-visit and forced to sign in again.
      if (authService.shouldRefreshToken(token)) {
        try {
          token = await authService.refreshToken(token);
          if (cancelled) return;
          authService.saveToken(token);
          setState((prev) => ({ ...prev, token }));
        } catch (error) {
          if (error instanceof AuthRequestError && error.status === 401) {
            if (!cancelled) clearSession();
            return;
          }
          // Network fault: carry on with the existing token.
        }
      }

      // The cached role is a snapshot from login time, so re-check it against
      // the server: a promotion or demotion should show up without logging out.
      try {
        const freshUser = await authService.getCurrentUser(token);
        if (cancelled) return;
        authService.updateCachedUser(freshUser);
        setState((prev) => ({ ...prev, user: freshUser }));
      } catch (error) {
        // A rejected token means the session is genuinely over, so end it rather
        // than leaving a signed-in shell whose every request fails. A network
        // fault keeps the cached user.
        if (error instanceof AuthRequestError && error.status === 401) {
          if (!cancelled) clearSession();
        }
      }
    };

    sync();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const savedAuth = authService.loadAuth();
      if (savedAuth) {
        setState({
          user: savedAuth.user,
          token: savedAuth.token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Signed out elsewhere, or the token was rejected mid-session.
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  const login = async () => {
    const authUrl = await authService.getAuthUrl();
    window.location.href = authUrl;
  };

  const logout = () => {
    authService.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
