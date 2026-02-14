import { Divider, Spinner } from "@heroui/react";
import { RankDisplay } from "../player-stats/RankDisplay";
import { getPlayerRank } from "@/utils/mappack.utils";
import { MappackRank } from "@/types/mappack.types";
import { usePlayerStats } from "@/hooks/usePlayerStats";

interface ModalPlayerStatsProps {
  mappackId: string;
  playerId: string;
  ranks: MappackRank[];
}

export function ModalPlayerStats({
  mappackId,
  playerId,
  ranks,
}: ModalPlayerStatsProps) {
  const { stats, loading, error } = usePlayerStats(mappackId, playerId);

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-center py-8">
          <Spinner size="sm" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const { entry, rank } = stats;

  // Get current rank
  const playerRank = getPlayerRank(entry.total_points, ranks);

  // Get next rank
  const sortedRanks = [...ranks].sort((a, b) => a.pointsNeeded - b.pointsNeeded);
  const nextRank = playerRank
    ? sortedRanks.find((r) => r.pointsNeeded > entry.total_points)
    : sortedRanks[0];

  return (
    <div className="mb-6 space-y-4">
      {/* Player Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">
              {entry.total_points.toLocaleString()} POINTS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-sm font-semibold text-white/70 bg-white/5 rounded-full">
              #{rank}
            </span>
          </div>
        </div>
        <Divider className="bg-white/10" />
      </div>

      {/* Rank Display */}
      {playerRank && (
        <>
          <RankDisplay
            rank={playerRank}
            nextRank={nextRank}
            currentPoints={entry.total_points}
          />
          <Divider className="bg-white/10" />
        </>
      )}
    </div>
  );
}