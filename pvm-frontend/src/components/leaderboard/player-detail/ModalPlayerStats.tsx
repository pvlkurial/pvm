import Link from "next/link";
import { MappackRank } from "@/types/mappack.types";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { getRankProgress } from "@/utils/mappack.utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RankDisplay } from "@/components/player-stats/RankDisplay";
import { StatTile } from "@/components/player-stats/StatTile";

interface ModalPlayerStatsProps {
  mappackId: string;
  playerId: string;
  playerName: string;
  ranks: MappackRank[];
}

export function ModalPlayerStats({
  mappackId,
  playerId,
  playerName,
  ranks,
}: ModalPlayerStatsProps) {
  const { stats, loading, error } = usePlayerStats(mappackId, playerId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error || !stats) return null;

  const { entry, rank } = stats;
  const { current, next } = getRankProgress(entry.total_points, ranks);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3 pr-10">
        <div className="min-w-0 max-w-full">
          <p className="eyebrow mb-2">Player</p>
          <h2 className="truncate font-display text-display-m">
            <Link
              href={`/players/${playerId}`}
              className="transition-colors hover:text-muted-foreground"
            >
              {playerName}
            </Link>
          </h2>
        </div>
        <Button variant="outline" size="sm" className="mb-1" asChild>
          <Link href={`/players/${playerId}`}>Profile</Link>
        </Button>
      </div>

      {/* Equal-weight tiles so no single figure dominates the dialog. */}
      <div className="flex flex-wrap gap-6">
        <StatTile label="Points" className="min-w-[110px] flex-1">
          <p className="stat-figure text-3xl">
            {entry.total_points.toLocaleString()}
          </p>
        </StatTile>

        <StatTile label="Leaderboard Rank" className="min-w-[110px] flex-1">
          <p
            className="stat-figure text-3xl"
            style={{ color: current?.color }}
          >
            #{rank}
          </p>
        </StatTile>

        {current && (
          <div className="min-w-[180px] flex-1">
            <RankDisplay rank={current} nextRank={next} currentPoints={entry.total_points} />
          </div>
        )}
      </div>
    </div>
  );
}
