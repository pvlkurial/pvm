"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { adminService } from "@/services/admin.service";
import { AdminUser, hasAtLeastRole } from "@/types/auth";
import { Mappack } from "@/types/mappack.types";
import { Spinner } from "@/components/ui/spinner";
import { SectionHeading } from "@/components/common/SectionHeading";
import { AdminUserRow } from "@/components/admin/AdminUserRow";
import { PlayerRoleSearch } from "@/components/admin/PlayerRoleSearch";

export default function AdminPanelPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [mappacks, setMappacks] = useState<Mappack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSuperAdmin = isAuthenticated && hasAtLeastRole(user?.role, "superadmin");

  const load = async () => {
    try {
      setError(null);
      const [userList, mappackList] = await Promise.all([
        adminService.listUsers(),
        adminService.listAllMappacks(),
      ]);
      setUsers(userList);
      setMappacks(mappackList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }
    load();
  }, [isAuthLoading, isSuperAdmin]);

  if (isAuthLoading || loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="font-display text-display-m">Superadmins only</p>
        <p className="mt-2 text-muted-foreground">You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <SectionHeading size="md">Admin Management</SectionHeading>

      <p className="text-body text-muted-foreground">
        Superadmins manage every mappack. Admins can only edit the mappacks
        granted to them here, and cannot create new ones.
      </p>

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive">
          {error}
        </div>
      )}

      <SectionHeading className="pt-4">Assign a Role</SectionHeading>
      <PlayerRoleSearch currentUserId={user?.id} onChanged={load} onError={setError} />

      <SectionHeading className="pt-4">Users with Accounts</SectionHeading>
      <div className="space-y-3">
        {users.map((adminUser) => (
          <AdminUserRow
            key={adminUser.id}
            user={adminUser}
            mappacks={mappacks}
            isSelf={adminUser.id === user?.id}
            onChanged={load}
            onError={setError}
          />
        ))}
        {users.length === 0 && <p className="text-muted-foreground">No users found.</p>}
      </div>
    </div>
  );
}
