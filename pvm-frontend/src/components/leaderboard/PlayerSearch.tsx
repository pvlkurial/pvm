"use client";
import { useState, useEffect, useRef } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import { mappackService, PlayerSearchResult } from "@/services/mappack.service";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const DEBOUNCE_MS = 300;
const RESULT_LIMIT = 5;

interface PlayerSearchProps {
  mappackId: string;
  onPlayerSelect: (playerId: string, playerName: string) => void;
  placeholder?: string;
  className?: string;
}

export function PlayerSearch({
  mappackId,
  onPlayerSelect,
  placeholder = "Search players...",
  className,
}: PlayerSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        setResults(await mappackService.searchPlayers(mappackId, query, RESULT_LIMIT));
        setShowDropdown(true);
      } catch (error) {
        console.error("Error searching players:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, mappackId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clear = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  const selectPlayer = (player: PlayerSearchResult) => {
    clear();
    onPlayerSelect(player.id, player.name);
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <label className="flex h-10 cursor-text items-center gap-3 rounded-full border border-border bg-surface-1 px-4 transition-colors hover:border-muted-foreground/40 focus-within:border-foreground">
        <LuSearch className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-ui text-foreground outline-none placeholder:text-faint"
        />
        <span className="flex w-3.5 shrink-0 items-center justify-center">
          {isLoading ? (
            <Spinner className="size-3.5" />
          ) : (
            query && (
              <button
                type="button"
                onClick={clear}
                aria-label="Clear search"
                className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              >
                <LuX className="size-3.5" />
              </button>
            )
          )}
        </span>
      </label>

      {showDropdown && (results.length > 0 || (!isLoading && query)) && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
          {results.length > 0 ? (
            results.map((player) => (
              <button
                key={player.id}
                type="button"
                onClick={() => selectPlayer(player)}
                className="flex w-full cursor-pointer items-center gap-3 border-b border-border-subtle px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface-3"
              >
                <span className="w-8 shrink-0 text-right font-mono text-mono-s text-faint">
                  #{player.rank}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-ui text-foreground">
                    {player.name}
                  </span>
                  <span className="mt-1 block font-mono text-mono-s text-muted-foreground">
                    {player.total_points.toLocaleString()} pts
                  </span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-4 text-center text-small text-muted-foreground">
              No players found for &quot;{query}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
