"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState } from "@/types/auth";
import { authService } from "@/services/authService";

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

  useEffect(() => {
    const savedAuth = authService.loadAuth();

    if (savedAuth) {
      setState({
        user: savedAuth.user,
        token: savedAuth.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
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
