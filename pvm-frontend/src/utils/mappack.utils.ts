import { MappackTrack, MappackTier, MappackRank } from "@/types/mappack.types";

export type TracksByTier = Record<
  string,
  { tier: MappackTier | null; tracks: MappackTrack[] }
>;

export function groupTracksByTier(tracks: MappackTrack[]): TracksByTier {
  const grouped = tracks.reduce(
    (acc, mappackTrack) => {
      const tierName = mappackTrack.tier?.name || "Unranked";
      if (!acc[tierName]) {
        acc[tierName] = {
          tier: mappackTrack.tier,
          tracks: [],
        };
      }
      acc[tierName].tracks.push(mappackTrack);
      return acc;
    },
    {} as TracksByTier,
  );

  for (const tierName in grouped) {
    grouped[tierName].tracks.sort(
      (a, b) => (a.orderPosition ?? 0) - (b.orderPosition ?? 0),
    );
  }

  return grouped;
}

/**
 * Orders tiers by their manual position first, falling back to points for tiers
 * that share a position (which is the case for every tier until one is given an
 * explicit order). The direction flips both keys, so the sort toggle still
 * reverses the whole list.
 */
export function sortTiersByPoints(
  tracksByTier: TracksByTier,
  order: "asc" | "desc" = "asc",
) {
  const direction = order === "asc" ? 1 : -1;

  return Object.keys(tracksByTier).sort((a, b) => {
    const tierA = tracksByTier[a].tier;
    const tierB = tracksByTier[b].tier;

    const positionDelta =
      (tierA?.orderPosition ?? 0) - (tierB?.orderPosition ?? 0);
    if (positionDelta !== 0) return positionDelta * direction;

    return ((tierA?.points ?? 0) - (tierB?.points ?? 0)) * direction;
  });
}

/** Same precedence as sortTiersByPoints, for a plain list of tiers. */
export function compareTiers(a: MappackTier, b: MappackTier): number {
  const positionDelta = (a.orderPosition ?? 0) - (b.orderPosition ?? 0);
  return positionDelta !== 0 ? positionDelta : a.points - b.points;
}

export function getPlayerRank(
  totalPoints: number,
  ranks: MappackRank[],
): MappackRank | null {
  const sortedRanks = [...ranks].sort(
    (a, b) => b.pointsNeeded - a.pointsNeeded,
  );

  for (const rank of sortedRanks) {
    if (totalPoints >= rank.pointsNeeded) {
      return rank;
    }
  }

  return null;
}

/**
 * Unlike getPlayerRank, a player below every threshold is bucketed into the
 * lowest rank rather than left unranked, so the leaderboard has no stray group
 * at the bottom.
 */
export function getLeaderboardRank(
  totalPoints: number,
  ranks: MappackRank[],
): MappackRank | null {
  const sorted = [...ranks].sort((a, b) => b.pointsNeeded - a.pointsNeeded);
  return (
    sorted.find((rank) => totalPoints >= rank.pointsNeeded) ??
    sorted[sorted.length - 1] ??
    null
  );
}

/** The player's current rank, the next one up, and progress (0-100) towards it. */
export function getRankProgress(totalPoints: number, ranks: MappackRank[]) {
  const current = getPlayerRank(totalPoints, ranks);
  const next = [...ranks]
    .sort((a, b) => a.pointsNeeded - b.pointsNeeded)
    .find((rank) => rank.pointsNeeded > totalPoints);

  const progress =
    current && next
      ? Math.min(
          ((totalPoints - current.pointsNeeded) /
            (next.pointsNeeded - current.pointsNeeded)) *
            100,
          100,
        )
      : 100;

  return { current, next, progress };
}
