"use client";
import { useEffect, useState } from "react";
import { Button, Checkbox, Chip, Select, SelectItem } from "@heroui/react";
import { adminService } from "@/services/admin.service";
import { AdminUser, Role } from "@/types/auth";
import { Mappack } from "@/types/mappack.types";
import { ADMIN_BUTTON, ADMIN_BUTTON_PRIMARY } from "@/constants/button-styles";
import {
  MODAL_SELECT_CLASSNAMES,
} from "@/constants/modal-styles";

const ROLES: { key: Role; label: string }[] = [
  { key: "user", label: "User" },
  { key: "admin", label: "Admin" },
  { key: "superadmin", label: "Superadmin" },
];

const ROLE_COLORS: Record<Role, "default" | "primary" | "warning"> = {
  user: "default",
  admin: "primary",
  superadmin: "warning",
};

interface AdminUserRowProps {
  user: AdminUser;
  mappacks: Mappack[];
  isSelf: boolean;
  onChanged: () => void;
  onError: (message: string) => void;
}

export function AdminUserRow({
  user,
  mappacks,
  isSelf,
  onChanged,
  onError,
}: AdminUserRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selected, setSelected] = useState<string[]>(user.mappack_ids ?? []);
  const [isSaving, setIsSaving] = useState(false);

  // Re-sync when the parent reloads after a role change.
  useEffect(() => {
    setSelected(user.mappack_ids ?? []);
  }, [user.mappack_ids]);

  const handleRoleChange = async (role: Role) => {
    if (role === user.role) return;
    setIsSaving(true);
    try {
      await adminService.setUserRole(user.id, role);
      onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to change role");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePermissions = async () => {
    setIsSaving(true);
    try {
      await adminService.setUserPermissions(user.id, selected);
      onChanged();
    } catch (err) {
      onError(
        err instanceof Error ? err.message : "Failed to save permissions",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggle = (mappackId: string) => {
    setSelected((current) =>
      current.includes(mappackId)
        ? current.filter((id) => id !== mappackId)
        : [...current, mappackId],
    );
  };

  const isDirty =
    JSON.stringify([...selected].sort()) !==
    JSON.stringify([...(user.mappack_ids ?? [])].sort());

  return (
    <div className="border border-neutral-700 rounded-lg bg-neutral-800 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">{user.name}</p>
          <p className="text-xs text-neutral-500 truncate">{user.id}</p>
        </div>

        <Chip size="sm" color={ROLE_COLORS[user.role] ?? "default"}>
          {user.role}
        </Chip>

        <Select
          aria-label={`Role for ${user.name}`}
          size="sm"
          variant="bordered"
          className="w-40"
          isDisabled={isSaving || isSelf}
          selectedKeys={new Set([user.role])}
          onSelectionChange={(keys) => {
            const value = Array.from(keys as Set<string>)[0] as Role;
            if (value) handleRoleChange(value);
          }}
          classNames={MODAL_SELECT_CLASSNAMES}
        >
          {ROLES.map((role) => (
            <SelectItem key={role.key}>{role.label}</SelectItem>
          ))}
        </Select>

        {user.role === "admin" && (
          <Button
            size="sm"
            className={ADMIN_BUTTON}
            onPress={() => setIsExpanded((open) => !open)}
          >
            {isExpanded ? "Hide" : "Mappacks"} ({selected.length})
          </Button>
        )}
      </div>

      {isSelf && (
        <p className="px-4 pb-2 text-xs text-neutral-500">
          You cannot change your own role.
        </p>
      )}

      {user.role === "superadmin" && (
        <p className="px-4 pb-3 text-xs text-neutral-500">
          Manages every mappack. Per-mappack grants do not apply.
        </p>
      )}

      {isExpanded && user.role === "admin" && (
        <div className="border-t border-neutral-700 px-4 py-3 space-y-3">
          {mappacks.length === 0 ? (
            <p className="text-neutral-400 text-sm">No mappacks exist yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {mappacks.map((mappack) => (
                <Checkbox
                  key={mappack.id}
                  isSelected={selected.includes(mappack.id)}
                  onValueChange={() => toggle(mappack.id)}
                  classNames={{ label: "text-white text-sm" }}
                >
                  {mappack.name}
                  <span className="text-neutral-500 text-xs ml-1">
                    ({mappack.type || "pvm"})
                  </span>
                </Checkbox>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              className={ADMIN_BUTTON}
              isDisabled={!isDirty || isSaving}
              onPress={() => setSelected(user.mappack_ids ?? [])}
            >
              Reset
            </Button>
            <Button
              size="sm"
              className={ADMIN_BUTTON_PRIMARY}
              isDisabled={!isDirty}
              isLoading={isSaving}
              onPress={handleSavePermissions}
            >
              Save Permissions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
