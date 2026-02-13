import { MappackTrack, MappackTier, MappackRank } from '@/types/mappack.types';

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
  tracksByTier: Record<string, { tier: MappackTier | null; tracks: MappackTrack[] }>,
  order: "asc" | "desc" = "asc"
) {
  return Object.keys(tracksByTier).sort((a, b) => {
    const pointsA = tracksByTier[a].tier?.points || 0;
    const pointsB = tracksByTier[b].tier?.points || 0;
    return order === "asc" ? pointsA - pointsB : pointsB - pointsA;
  });
}

export function getPlayerRank(
  totalPoints: number,
  ranks: MappackRank[]
): MappackRank | null {
  // Sort ranks by points_required (descending)
  const sortedRanks = [...ranks].sort((a, b) => b.pointsNeeded - a.pointsNeeded);
  
  // Find the highest rank the player qualifies for
  for (const rank of sortedRanks) {
    if (totalPoints >= rank.pointsNeeded) {
      return rank;
    }
  }
  
  return null; // Player hasn't reached any rank yet
}