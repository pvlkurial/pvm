"use client";
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { PlayerWithRole, Role } from "@/types/auth";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { RoleSelect } from "./RoleSelect";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

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

  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed.length < MIN_QUERY_LENGTH) {
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
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed]);

  const handleRoleChange = async (player: PlayerWithRole, role: Role) => {
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
    <div className="space-y-3 rounded-xl border border-border bg-surface-1 p-4">
      <div className="flex items-end gap-3">
        <Field label="Search players" className="flex-1">
          <Input
            placeholder="Start typing a player name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Field>
        {isSearching && <Spinner className="mb-3" />}
      </div>

      {trimmed.length > 0 && trimmed.length < MIN_QUERY_LENGTH && (
        <p className="text-small text-faint">Type at least 2 characters to search.</p>
      )}

      {!isSearching && trimmed.length >= MIN_QUERY_LENGTH && results.length === 0 && (
        <p className="text-small text-muted-foreground">No players matched.</p>
      )}

      <div className="space-y-2">
        {results.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 rounded-xl bg-surface-2 px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-small">{player.name}</p>
              <p className="mt-1 truncate tabular-nums text-caption text-faint">{player.id}</p>
            </div>

            {!player.has_login && <Badge>never signed in</Badge>}

            <RoleSelect
              value={player.role}
              onChange={(role) => handleRoleChange(player, role)}
              playerName={player.name}
              disabled={savingId === player.id || player.id === currentUserId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
