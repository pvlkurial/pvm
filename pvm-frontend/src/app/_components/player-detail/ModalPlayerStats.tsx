import { Spinner } from "@heroui/react";
import { RankDisplay } from "../player-stats/RankDisplay";
import { getPlayerRank } from "@/utils/mappack.utils";
import { MappackRank } from "@/types/mappack.types";
import { usePlayerStats } from "@/hooks/usePlayerStats";

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
  const sortedRanks = [...ranks].sort((a, b) => a.pointsNeeded - b.pointsNeeded);
  const nextRank = playerRank
    ? sortedRanks.find((r) => r.pointsNeeded > entry.total_points)
    : sortedRanks[0];

  const color = playerRank?.color ?? accentColor ?? "#ffffff";

  return (
    <div className="flex flex-col gap-3">
      {/* Player name — full width */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-white/30 mb-0.5 text-label">
          Player
        </p>
        <h2 className="text-4xl font-bold leading-tight truncate text-label">
          {playerName}
        </h2>
      </div>

      {/* Points — full width */}
      <p className="text-5xl font-ruigslay tracking-wide font-bold text-white leading-none">
        {entry.total_points.toLocaleString()} PTS
      </p>

      {/* Leaderboard rank + RankDisplay inline */}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-white/30 mb-0.5 text-label">
            Leaderboard Rank
          </p>
          <p
            className="text-6xl font-ruigslay font-bold leading-none tracking-widest"
            style={{ color }}
          >
            #{rank}
          </p>
        </div>

        {playerRank && (
          <div className="w-[200px] shrink-0">
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