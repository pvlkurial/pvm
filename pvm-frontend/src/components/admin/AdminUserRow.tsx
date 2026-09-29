"use client";
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { AdminUser, Role } from "@/types/auth";
import { Mappack } from "@/types/mappack.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SwitchField } from "@/components/ui/switch";
import { RoleSelect } from "./RoleSelect";

interface AdminUserRowProps {
  user: AdminUser;
  mappacks: Mappack[];
  isSelf: boolean;
  onChanged: () => void;
  onError: (message: string) => void;
}

const sameIds = (a: string[], b: string[]) =>
  JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

export function AdminUserRow({
  user,
  mappacks,
  isSelf,
  onChanged,
  onError,
}: AdminUserRowProps) {
  const savedIds = user.mappack_ids ?? [];
  const [isExpanded, setIsExpanded] = useState(false);
  const [selected, setSelected] = useState<string[]>(savedIds);
  const [isSaving, setIsSaving] = useState(false);

  // Re-sync when the parent reloads after a role change.
  useEffect(() => {
    setSelected(user.mappack_ids ?? []);
  }, [user.mappack_ids]);

  const runSave = async (save: () => Promise<void>, failure: string) => {
    setIsSaving(true);
    try {
      await save();
      onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : failure);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleChange = (role: Role) =>
    runSave(() => adminService.setUserRole(user.id, role), "Failed to change role");

  const handleSupporterChange = (isSupporter: boolean) =>
    runSave(
      () => adminService.setUserSupporter(user.id, isSupporter),
      "Failed to change supporter status",
    );

  const handleSavePermissions = () =>
    runSave(
      () => adminService.setUserPermissions(user.id, selected),
      "Failed to save permissions",
    );

  const toggle = (mappackId: string) => {
    setSelected((current) =>
      current.includes(mappackId)
        ? current.filter((id) => id !== mappackId)
        : [...current, mappackId],
    );
  };

  const isDirty = !sameIds(selected, savedIds);
  const isAdmin = user.role === "admin";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-1">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-ui font-medium">{user.name}</p>
          <p className="mt-1 truncate tabular-nums text-caption text-faint">{user.id}</p>
        </div>

        <Badge variant={user.role === "user" ? "default" : "inverse"}>{user.role}</Badge>

        <RoleSelect
          value={user.role}
          onChange={handleRoleChange}
          playerName={user.name}
          disabled={isSaving || isSelf}
        />

        {isAdmin && (
          <Button variant="outline" size="sm" onClick={() => setIsExpanded((open) => !open)}>
            {isExpanded ? "Hide" : "Mappacks"} ({selected.length})
          </Button>
        )}
      </div>

      <SwitchField
        label="Patreon supporter"
        description={
          user.patreon_supporter
            ? "Already a supporter through their connected Patreon"
            : user.patreon_user_id
              ? "Patreon connected, not on the Support tier. Can update their own records, once every 5 minutes"
              : "Can update their own records, once every 5 minutes"
        }
        checked={!!user.is_supporter}
        onCheckedChange={handleSupporterChange}
        disabled={isSaving}
        className="px-4 pb-3"
      />

      {isSelf && (
        <p className="px-4 pb-3 text-small text-faint">You cannot change your own role.</p>
      )}

      {user.role === "superadmin" && (
        <p className="px-4 pb-3 text-small text-faint">
          Manages every mappack. Per-mappack grants do not apply.
        </p>
      )}

      {isExpanded && isAdmin && (
        <div className="space-y-3 border-t border-border-subtle px-4 py-3">
          {mappacks.length === 0 ? (
            <p className="text-small text-muted-foreground">No mappacks exist yet.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {mappacks.map((mappack) => (
                <label
                  key={mappack.id}
                  className="flex cursor-pointer items-center gap-2 text-small"
                >
                  <Checkbox
                    checked={selected.includes(mappack.id)}
                    onCheckedChange={() => toggle(mappack.id)}
                  />
                  {mappack.name}
                  <span className="tabular-nums text-caption text-faint">
                    ({mappack.type || "pvm"})
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!isDirty || isSaving}
              onClick={() => setSelected(savedIds)}
            >
              Reset
            </Button>
            <Button
              size="sm"
              disabled={!isDirty}
              loading={isSaving}
              onClick={handleSavePermissions}
            >
              Save Permissions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
