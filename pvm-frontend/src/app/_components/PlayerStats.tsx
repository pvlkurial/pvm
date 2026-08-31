import { usePlayerStats } from "@/hooks/usePlayerStats";
import { OverlappingProgressBars } from "./player-stats/OverlappingProgressBars";
import { RankDisplay } from "./player-stats/RankDisplay";
import { StatTile } from "./player-stats/StatTile";
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
      {/* Points and rank carry equal weight rather than one dwarfing the other. */}
      <div className="grid grid-cols-2 gap-4">
        <StatTile label="Points">
          <p className="text-2xl font-ruigslay font-bold text-white leading-none">
            {entry.total_points.toLocaleString()}
          </p>
        </StatTile>

        <StatTile label="Rank">
          <p
            className="text-2xl font-ruigslay font-bold leading-none"
            style={{ color: playerRank?.color ?? "#ffffff" }}
          >
            #{rank}
          </p>
        </StatTile>
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
