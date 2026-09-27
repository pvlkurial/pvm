import { useState, useEffect } from "react";
import { Track } from "@/types/mappack.types";
import { trackService } from "@/services/track.service";

/**
 * Loads a track, including the player's PB when a player is given. The player
 * usually arrives a moment after the first render (once sign-in state loads),
 * so the track is refetched then; the earlier copy stays on screen meanwhile
 * and a response that has been superseded is ignored.
 */
export function useTrackDetails(mappackId: string, trackId: string, playerId?: string) {
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    trackService
      .getTrackDetails(mappackId, trackId, playerId)
      .then((data) => {
        if (!cancelled) setTrack(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err as Error);
        console.error("Error fetching track:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [mappackId, trackId, playerId]);

  return { track, loading: !track && !error, error };
}
