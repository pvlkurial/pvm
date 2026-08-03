"use client";
import { useEffect, useState } from "react";
import { Chip, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { adminService } from "@/services/admin.service";
import { PlayerWithRole, Role } from "@/types/auth";
import { ROLE_LABELS } from "@/constants/roles";
import {
  MODAL_INPUT_CLASSNAMES,
  MODAL_SELECT_CLASSNAMES,
} from "@/constants/modal-styles";

const ROLES: Role[] = ["user", "admin", "superadmin"];

interface PlayerRoleSearchProps {
  currentUserId: string | undefined;
  onChanged: () => void;
  onError: (message: string) => void;
}

/**
 * Searches all stored players so a role can be assigned to any of them,
 * including players who have never signed in.
 */
export function PlayerRoleSearch({
  currentUserId,
  onChanged,
  onError,
}: PlayerRoleSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlayerWithRole[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    // Debounced so typing does not fire a request per keystroke.
    const timer = setTimeout(() => {
      adminService
        .searchPlayers(trimmed)
        .then((players) => {
          if (!cancelled) setResults(players);
        })
        .catch((err) => {
          if (!cancelled) {
            onError(err instanceof Error ? err.message : "Player search failed");
          }
        })
        .finally(() => {
          if (!cancelled) setIsSearching(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleRoleChange = async (player: PlayerWithRole, role: Role) => {
    if (role === player.role) return;
    setSavingId(player.id);
    try {
      await adminService.setUserRole(player.id, role);
      setResults((current) =>
        current.map((entry) =>
          entry.id === player.id ? { ...entry, role, has_login: true } : entry,
        ),
      );
      onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to assign role");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="border border-neutral-700 rounded-lg bg-neutral-800 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Input
          label="Search players"
          placeholder="Start typing a player name..."
          variant="bordered"
          value={query}
          onValueChange={setQuery}
          classNames={MODAL_INPUT_CLASSNAMES}
        />
        {isSearching && <Spinner size="sm" />}
      </div>

      {query.trim().length > 0 && query.trim().length < 2 && (
        <p className="text-xs text-neutral-500">
          Type at least 2 characters to search.
        </p>
      )}

      {!isSearching && query.trim().length >= 2 && results.length === 0 && (
        <p className="text-sm text-neutral-400">No players matched.</p>
      )}

      <div className="space-y-2">
        {results.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 rounded-lg bg-neutral-900/60 px-3 py-2"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{player.name}</p>
              <p className="text-xs text-neutral-500 truncate">{player.id}</p>
            </div>

            {!player.has_login && (
              <Chip size="sm" variant="flat" className="text-neutral-400">
                never signed in
              </Chip>
            )}

            <Select
              aria-label={`Role for ${player.name}`}
              size="sm"
              variant="bordered"
              className="w-40"
              isDisabled={savingId === player.id || player.id === currentUserId}
              selectedKeys={new Set([player.role])}
              onSelectionChange={(keys) => {
                const value = Array.from(keys as Set<string>)[0] as Role;
                if (value) handleRoleChange(player, value);
              }}
              classNames={MODAL_SELECT_CLASSNAMES}
            >
              {ROLES.map((role) => (
                <SelectItem key={role}>{ROLE_LABELS[role]}</SelectItem>
              ))}
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
