// hooks/usePlayerStats.ts
import { useState, useEffect } from 'react';
import { mappackService } from '@/services/mappack.service';
import { PlayerLeaderboardEntry } from '@/types/mappack.types';

export function usePlayerStats(mappackId: string, playerId: string | undefined) {
  const [stats, setStats] = useState<PlayerLeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!playerId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await mappackService.getPlayerLeaderboardEntry(mappackId, playerId);
        setStats(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching player stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [mappackId, playerId]);

  return { stats, loading, error };
}