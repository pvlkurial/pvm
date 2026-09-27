"use client";

import React, { useEffect, useState } from "react";
import { Track } from "@/types/mappack.types";
import { trackService } from "@/services/track.service";
import { overlayService, OverlaySelection } from "@/services/overlay.service";
import { findGoalByName } from "@/utils/track.utils";
import { TrackOverlay } from "@/components/overlay/TrackOverlay";
import { OverlayStyleParams, parseOverlayStyle } from "@/components/overlay/overlayStyle";

/** How often the overlay checks whether the player picked another map or goal. */
const SELECTION_POLL_MS = 5_000;
/** How often the shown track is refreshed, e.g. for a new PB. */
const TRACK_REFRESH_MS = 30_000;

interface OverlayPageProps {
  searchParams: Promise<OverlayStyleParams & { player?: string }>;
}

/**
 * One URL per player: shows whichever map (and goal) they last picked on the
 * site, so the OBS browser source never needs changing.
 */
export default function PlayerOverlayPage({ searchParams }: OverlayPageProps) {
  const query = React.use(searchParams);
  const playerId = query.player ?? "";

  const [selection, setSelection] = useState<OverlaySelection | null>(null);
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    if (!playerId) return;
    const poll = () =>
      overlayService
        .get(playerId)
        .then((next) =>
          // Keep the same object when nothing changed, so the track isn't refetched.
          setSelection((current) =>
            current?.mappack_id === next?.mappack_id &&
            current?.track_id === next?.track_id &&
            current?.goal === next?.goal
              ? current
              : next,
          ),
        )
        .catch(console.error);

    poll();
    const interval = setInterval(poll, SELECTION_POLL_MS);
    return () => clearInterval(interval);
  }, [playerId]);

  const mappackId = selection?.mappack_id;
  const trackId = selection?.track_id;

  useEffect(() => {
    if (!mappackId || !trackId) return;
    let cancelled = false;
    const load = () =>
      trackService
        .getTrackDetails(mappackId, trackId, playerId)
        .then((data) => !cancelled && setTrack(data))
        .catch(console.error);

    load();
    const interval = setInterval(load, TRACK_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [mappackId, trackId, playerId]);

  // Nothing is drawn until the selected track has loaded, so a switch goes
  // straight from the old map to the new one.
  if (!track || track.id !== trackId) return null;

  return (
    <TrackOverlay
      track={track}
      goal={findGoalByName(track, selection?.goal)}
      style={parseOverlayStyle(query)}
    />
  );
}
