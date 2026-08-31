import { usePlayerStats } from "@/hooks/usePlayerStats";
import { OverlappingProgressBars } from "./player-stats/OverlappingProgressBars";
import { RankDisplay } from "./player-stats/RankDisplay";
import { getPlayerRank } from "@/utils/mappack.utils";
import { MappackRank } from "@/types/mappack.types";

interface PlayerStatsProps {
  mappackId: string;
  playerId: string;
  totalTracks: number;
  ranks: MappackRank[];
}

function StatsFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-4 p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-ruigslay font-bold text-white">
          My Stats
        </h3>
        <div className="h-px bg-white/10" />
      </div>
      {children}
    </div>
  );
}

export function PlayerStats({
  mappackId,
  playerId,
  totalTracks,
  ranks,
}: PlayerStatsProps) {
  const { stats, loading, error } = usePlayerStats(mappackId, playerId);

  if (loading) {
    return (
      <StatsFrame>
        <div className="animate-pulse space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-white/5 rounded-lg" />
            <div className="h-16 bg-white/5 rounded-lg" />
          </div>
          <div className="h-24 bg-white/5 rounded-lg" />
          <div className="h-3 bg-white/5 rounded-full" />
        </div>
      </StatsFrame>
    );
  }

  if (error || !stats) {
    return null;
  }

  const { entry, rank } = stats;

  const playerRank = getPlayerRank(entry.total_points, ranks);

  const sortedRanks = [...ranks].sort(
    (a, b) => a.pointsNeeded - b.pointsNeeded,
  );
  const nextRank = playerRank
    ? sortedRanks.find((r) => r.pointsNeeded > entry.total_points)
    : sortedRanks[0];

  return (
    <StatsFrame>
      {/* Points lead, with the leaderboard rank sitting on the same baseline.
          Sized responsively because this column is only a sixth of the grid. */}
      <div className="flex items-end justify-between gap-2">
        <p className="font-ruigslay font-bold text-white leading-none text-4xl xl:text-5xl">
          {entry.total_points.toLocaleString()}
          <span className="text-xl xl:text-2xl text-white/40 ml-1.5">PTS</span>
        </p>
        <span className="text-sm text-label text-white/60 shrink-0 whitespace-nowrap">
          RANK #{rank}
        </span>
      </div>

      {/* RankDisplay brings its own label and next-rank progress. */}
      {playerRank && (
        <RankDisplay
          rank={playerRank}
          nextRank={nextRank}
          currentPoints={entry.total_points}
        />
      )}

      <OverlappingProgressBars
        completionCurrent={entry.best_achievements_count}
        completionTotal={totalTracks}
      />
    </StatsFrame>
  );
}
