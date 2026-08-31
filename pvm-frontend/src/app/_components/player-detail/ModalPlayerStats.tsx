import { Spinner } from "@heroui/react";
import { RankDisplay } from "../player-stats/RankDisplay";
import { getPlayerRank } from "@/utils/mappack.utils";
import { MappackRank } from "@/types/mappack.types";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { StatTile } from "../player-stats/StatTile";

interface ModalPlayerStatsProps {
  mappackId: string;
  playerId: string;
  playerName: string;
  ranks: MappackRank[];
  accentColor?: string;
}

export function ModalPlayerStats({
  mappackId,
  playerId,
  playerName,
  ranks,
  accentColor,
}: ModalPlayerStatsProps) {
  const { stats, loading, error } = usePlayerStats(mappackId, playerId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="sm" />
      </div>
    );
  }

  if (error || !stats) return null;

  const { entry, rank } = stats;

  const playerRank = getPlayerRank(entry.total_points, ranks);
  const sortedRanks = [...ranks].sort(
    (a, b) => a.pointsNeeded - b.pointsNeeded,
  );
  const nextRank = playerRank
    ? sortedRanks.find((r) => r.pointsNeeded > entry.total_points)
    : sortedRanks[0];

  const color = playerRank?.color ?? accentColor ?? "#ffffff";

  return (
    <div className="flex flex-col gap-4">
      <div className="min-w-0">
        <p className="text-[10px] tracking-widest uppercase text-white/35 mb-1 text-label">
          Player
        </p>
        <h2 className="text-3xl font-bold leading-tight truncate text-label">
          {playerName}
        </h2>
      </div>

      {/* Equal-weight tiles so no single figure dominates the modal. */}
      <div className="flex flex-wrap gap-2">
        <StatTile label="Points" className="flex-1 min-w-[110px]">
          <p className="text-2xl font-ruigslay font-bold text-white leading-none">
            {entry.total_points.toLocaleString()}
          </p>
        </StatTile>

        <StatTile label="Leaderboard Rank" className="flex-1 min-w-[110px]">
          <p
            className="text-2xl font-ruigslay font-bold leading-none"
            style={{ color }}
          >
            #{rank}
          </p>
        </StatTile>

        {/* RankDisplay brings its own label and next-rank progress, so it sits
            in the tile directly rather than inside StatTile. */}
        {playerRank && (
          <div className="flex-1 min-w-[180px] rounded-lg bg-white/[0.04] border border-white/[0.06] px-4 py-3">
            <RankDisplay
              rank={playerRank}
              nextRank={nextRank}
              currentPoints={entry.total_points}
            />
          </div>
        )}
      </div>
    </div>
  );
}
