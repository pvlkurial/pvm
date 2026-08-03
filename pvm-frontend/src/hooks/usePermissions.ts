"use client";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { adminService } from "@/services/admin.service";
import { MyPermissions } from "@/types/auth";

/**
 * What the signed-in user may manage. Sourced from the backend rather than
 * inferred from the cached role, so revoked grants take effect without re-login.
 */
export function usePermissions() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [permissions, setPermissions] = useState<MyPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setPermissions(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    adminService
      .getMyPermissions()
      .then((result) => {
        if (!cancelled) setPermissions(result);
      })
      .catch(() => {
        if (!cancelled) setPermissions(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAuthLoading, user?.id]);

  const canEditMappack = useCallback(
    (mappackId: string | undefined) => {
      if (!permissions || !mappackId) return false;
      if (permissions.manages_all) return true;
      return permissions.mappack_ids.includes(mappackId);
    },
    [permissions],
  );

  return {
    permissions,
    isLoading,
    isSuperAdmin: permissions?.manages_all ?? false,
    canCreateMappack: permissions?.can_create_mappack ?? false,
    canEditMappack,
  };
}
