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

/** Laid out like a mappack card: title, a colour strip, then the figures. */
function StatsCard({
  stripColor,
  children,
}: {
  stripColor?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="sticky top-4 self-start p-4">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface-1">
        <h3 className="px-5 pt-5 pb-4 font-display text-title">My Stats</h3>
        <div
          className="h-1.5"
          style={{ backgroundColor: stripColor || "var(--pack-neutral)" }}
        />
        <div className="space-y-5 p-5">{children}</div>
      </div>
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
      <StatsCard stripColor={accentColor}>
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded-xl bg-surface-3" />
          <div className="h-16 rounded-xl bg-surface-3" />
          <div className="h-2 rounded-full bg-surface-3" />
        </div>
      </StatsCard>
    );
  }

  if (error || !stats) {
    return null;
  }

  const { entry, rank } = stats;
  const { current, next } = getRankProgress(entry.total_points, ranks);

  return (
    <StatsCard stripColor={current?.color || accentColor}>
      <div>
        <p className="eyebrow mb-2">Points</p>
        {/* Sized responsively because this column is only a sixth of the grid. */}
        <p className="stat-figure text-3xl xl:text-4xl">
          {entry.total_points.toLocaleString()}
        </p>
        <p className="mt-2 text-small text-muted-foreground">Rank #{rank}</p>
      </div>

      {current && (
        <RankDisplay rank={current} nextRank={next} currentPoints={entry.total_points} />
      )}

      <div className="space-y-2 border-t border-border-subtle pt-5">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">Maps played</span>
          <span className="text-small tabular-nums text-muted-foreground">
            {entry.best_achievements_count}/{totalTracks}
          </span>
        </div>
        <ProgressBar
          current={entry.best_achievements_count}
          total={totalTracks}
          color={accentColor || undefined}
        />
      </div>
    </StatsCard>
  );
}
