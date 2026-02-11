import { MappackTrack, MappackTier } from '@/types/mappack.types';

export function groupTracksByTier(tracks: MappackTrack[]) {
  return tracks.reduce((acc, mappackTrack) => {
    const tierName = mappackTrack.tier?.name || "Unranked";
    if (!acc[tierName]) {
      acc[tierName] = {
        tier: mappackTrack.tier,
        tracks: [],
      };
    }
    acc[tierName].tracks.push(mappackTrack);
    return acc;
  }, {} as Record<string, { tier: MappackTier | null; tracks: MappackTrack[] }>);
}

export function sortTiersByPoints(
  tracksByTier: Record<string, { tier: MappackTier | null; tracks: MappackTrack[] }>
) {
  return Object.keys(tracksByTier).sort((a, b) => {
    const pointsA = tracksByTier[a].tier?.points || 0;
    const pointsB = tracksByTier[b].tier?.points || 0;
    return pointsA - pointsB;
  });
}