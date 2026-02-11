import { useState, useEffect } from 'react';
import { Mappack } from '@/types/mappack.types';
import { mappackService } from '@/services/mappack.service';

export function useMappack(mappackId: string, playerId?: string) {
  const [mappack, setMappack] = useState<Mappack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMappack = async () => {
      try {
        setLoading(true);
        const data = await mappackService.getMappack(mappackId, playerId);
        setMappack(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching mappack:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMappack();
  }, [mappackId, playerId]);

  const refetch = async () => {
    try {
      const data = await mappackService.getMappack(mappackId, playerId);
      setMappack(data);
    } catch (err) {
      console.error('Error refetching:', err);
    }
  };

  return { mappack, loading, error, refetch };
}