"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Role, hasAtLeastRole } from "@/types/auth";
import { ReactNode } from "react";

interface RequireRoleProps {
  /** Minimum role required. A superadmin satisfies "admin", but not the reverse. */
  role: Role;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequireRole({
  role,
  children,
  fallback = null,
}: RequireRoleProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !hasAtLeastRole(user?.role, role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
