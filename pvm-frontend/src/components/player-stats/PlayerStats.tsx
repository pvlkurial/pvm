"use client";
import { MappackRank } from "@/types/mappack.types";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { getRankProgress } from "@/utils/mappack.utils";
import { ProgressBar } from "@/components/common/ProgressBar";
import { SidebarHeading } from "@/components/common/SidebarHeading";
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
    <aside className="sticky top-4 self-start p-5">
      <SidebarHeading>My Stats</SidebarHeading>
      {/* Each section sits between hairlines. */}
      <div className="divide-y divide-border [&>*]:py-5">{children}</div>
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
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded-xl bg-surface-1" />
          <div className="h-16 rounded-xl bg-surface-1" />
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

      <div className="space-y-2">
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
    </StatsFrame>
  );
}
