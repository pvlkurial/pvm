import { useState, useEffect } from 'react';
import { Track } from '@/types/mappack.types';
import { trackService } from '@/services/track.service';

export function useTrackDetails(mappackId: string, trackId: string, playerId?: string) {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setLoading(true);
        const data = await trackService.getTrackDetails(mappackId, trackId, playerId);
        setTrack(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching track:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, [mappackId, trackId, playerId]);

  return { track, loading, error };
}