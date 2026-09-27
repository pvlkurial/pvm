import { useState, useEffect } from "react";
import { mappackService } from "@/services/mappack.service";
import { PlayerLeaderboardEntry } from "@/types/mappack.types";

export function usePlayerStats(mappackId: string, playerId: string | undefined) {
  const [stats, setStats] = useState<PlayerLeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!playerId) {
      setLoading(false);
      return;
    }

    // Ignores a response that has been superseded by a newer request.
    let cancelled = false;
    setLoading(true);

    mappackService
      .getPlayerLeaderboardEntry(mappackId, playerId)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err as Error);
        console.error("Error fetching player stats:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mappackId, playerId]);

  return { stats, loading, error };
}
