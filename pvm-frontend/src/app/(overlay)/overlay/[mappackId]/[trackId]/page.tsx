"use client";

import React, { useEffect, useState } from "react";
import { Track } from "@/types/mappack.types";
import { trackService } from "@/services/track.service";
import { getGoalsWithWorldRecord } from "@/utils/track.utils";
import { TrackOverlay } from "@/components/overlay/TrackOverlay";
import { OverlayStyleParams, parseOverlayStyle } from "@/components/overlay/overlayStyle";

interface OverlayPageProps {
  params: Promise<{ mappackId: string; trackId: string }>;
  searchParams: Promise<OverlayStyleParams & { playerId?: string; goalIndex?: string }>;
}

/**
 * The original per-map overlay URL. Kept working for existing OBS setups; new
 * ones use /overlay?player=, which follows the map picked on the site.
 */
export default function FixedTrackOverlayPage({ params, searchParams }: OverlayPageProps) {
  const { mappackId, trackId } = React.use(params);
  const query = React.use(searchParams);
  const goalIndex = query.goalIndex ? Number(query.goalIndex) : 0;
  const playerId = query.playerId ?? "";

  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    const load = () =>
      trackService
        .getTrackDetails(mappackId, trackId, playerId)
        .then(setTrack)
        .catch(console.error);

    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [mappackId, trackId, playerId]);

  if (!track) return null;

  const goals = getGoalsWithWorldRecord(track);
  return (
    <TrackOverlay
      track={track}
      goal={goals[goalIndex] ?? goals[0]}
      style={parseOverlayStyle(query)}
    />
  );
}
