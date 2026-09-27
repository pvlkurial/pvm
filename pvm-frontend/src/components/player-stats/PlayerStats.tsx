"use client";
import { MappackRank } from "@/types/mappack.types";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { getRankProgress } from "@/utils/mappack.utils";
import { ProgressBar } from "@/components/common/ProgressBar";
import { RankDisplay } from "./RankDisplay";

interface PlayerStatsProps {
  mappackId: string;
  playerId: string;
  totalTracks: number;
  ranks: MappackRank[];
  accentColor?: string;
}

function StatsFrame({ children }: { children: React.ReactNode }) {
  return (
    <aside className="sticky top-4 space-y-6 self-start p-6">
      <h3 className="border-b border-border pb-3 font-display text-title">
        My Stats
      </h3>
      {children}
    </aside>
  );
}

export function PlayerStats({
  mappackId,
  playerId,
  totalTracks,
  ranks,
  accentColor,
}: PlayerStatsProps) {
  const { stats, loading, error } = usePlayerStats(mappackId, playerId);

  if (loading) {
    return (
      <StatsFrame>
        <div className="animate-pulse space-y-3">
          <div className="h-12 rounded-xl bg-surface-1" />
          <div className="h-24 rounded-xl bg-surface-1" />
          <div className="h-2 rounded-full bg-surface-1" />
        </div>
      </StatsFrame>
    );
  }

  if (error || !stats) {
    return null;
  }

  const { entry, rank } = stats;
  const { current, next } = getRankProgress(entry.total_points, ranks);

  return (
    <StatsFrame>
      {/* Sized responsively because this column is only a sixth of the grid. */}
      <div>
        <p className="stat-figure text-3xl xl:text-4xl">
          {entry.total_points.toLocaleString()}
          <span className="ml-1.5 text-base text-faint xl:text-xl">PTS</span>
        </p>
        <p className="mt-2 text-small font-semibold tracking-wide text-muted-foreground uppercase">
          Rank #{rank}
        </p>
      </div>

      {current && (
        <RankDisplay rank={current} nextRank={next} currentPoints={entry.total_points} />
      )}

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">Maps played</span>
          <span className="tabular-nums text-caption text-muted-foreground">
            {entry.best_achievements_count}/{totalTracks}
          </span>
        </div>
        <ProgressBar
          current={entry.best_achievements_count}
          total={totalTracks}
          color={accentColor || undefined}
        />
      </div>
    </StatsFrame>
  );
}
