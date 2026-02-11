"use client";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface RequireRoleProps {
  role: "user" | "admin";
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequireRole({ 
  role, 
  children, 
  fallback = null 
}: RequireRoleProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Admin can access everything
  if (user?.role === "admin") {
    return <>{children}</>;
  }

  // Check if user has required role
  if (user?.role === role) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}