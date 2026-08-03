"use client";
import { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface RequireMappackPermissionProps {
  mappackId: string | undefined;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Renders children only if the signed-in user may manage this specific mappack:
 * superadmins always, admins only where granted.
 */
export default function RequireMappackPermission({
  mappackId,
  children,
  fallback = null,
}: RequireMappackPermissionProps) {
  const { canEditMappack, isLoading } = usePermissions();

  if (isLoading || !canEditMappack(mappackId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
