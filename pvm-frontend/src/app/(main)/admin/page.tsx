"use client";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { useAuth } from "@/contexts/AuthContext";
import { adminService } from "@/services/admin.service";
import { AdminUser } from "@/types/auth";
import { Mappack } from "@/types/mappack.types";
import { hasAtLeastRole } from "@/types/auth";
import { AdminUserRow } from "@/app/_components/admin/AdminUserRow";
import { PlayerRoleSearch } from "@/app/_components/admin/PlayerRoleSearch";
import { SectionHeading } from "@/app/_components/SectionHeading";

export default function AdminPanelPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [mappacks, setMappacks] = useState<Mappack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSuperAdmin =
    isAuthenticated && hasAtLeastRole(user?.role, "superadmin");

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
        <Spinner />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <p className="text-2xl font-ruigslay text-white">Superadmins only</p>
        <p className="text-neutral-400 mt-2">
          You do not have access to this page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <SectionHeading>Admin Management</SectionHeading>

      <p className="text-neutral-400 text-sm">
        Superadmins manage every mappack. Admins can only edit the mappacks
        granted to them here, and cannot create new ones.
      </p>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
          {error}
        </div>
      )}

      <SectionHeading className="pt-2">Assign a Role</SectionHeading>

      <PlayerRoleSearch
        currentUserId={user?.id}
        onChanged={load}
        onError={setError}
      />

      <SectionHeading className="pt-2">Users with Accounts</SectionHeading>

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
        {users.length === 0 && (
          <p className="text-neutral-400">No users found.</p>
        )}
      </div>
    </div>
  );
}
