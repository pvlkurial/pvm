import { Card, CardBody, Divider } from "@heroui/react";
import { FaTrophy, FaStar } from "react-icons/fa";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { OverlappingProgressBars } from "./player-stats/OverlappingProgressBars";
import { RankDisplay } from "./player-stats/RankDisplay";
import { getPlayerRank } from "@/utils/mappack.utils";
import { MappackRank } from "@/types/mappack.types";
import { PiRankingBold } from "react-icons/pi";

interface PlayerStatsProps {
  mappackId: string;
  playerId: string;
  totalTracks: number;
  totalTimeGoals: number;
  ranks: MappackRank[];
}

export function PlayerStats({
  mappackId,
  playerId,
  totalTracks,
  totalTimeGoals,
  ranks,
}: PlayerStatsProps) {
  const { stats, loading, error } = usePlayerStats(mappackId, playerId);

  if (loading) {
    return (
      <Card className="bg-neutral-800 sticky top-4">
        <CardBody className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded" />
            <div className="h-4 bg-white/10 rounded" />
            <div className="h-4 bg-white/10 rounded" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error || !stats) {
    return null;
  }

  const { entry, rank } = stats;
  
  const playerRank = getPlayerRank(entry.total_points, ranks);
  
  const sortedRanks = [...ranks].sort((a, b) => a.pointsNeeded - b.pointsNeeded);
  const nextRank = playerRank 
    ? sortedRanks.find(r => r.pointsNeeded > entry.total_points)
    : sortedRanks[0];

  return (
    <div className="bg-black-0 sticky top-4">
      <div className="p-6 space-y-6">
        {/* Player Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-3xl font-ruigslay font-bold text-white ">
              Stats
            </h3>
          </div>
            <Divider className="bg-white/50" />

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-white">

              <p className="text-2xl font-bold text-white">
                {entry.total_points.toLocaleString()} POINTS
              </p>
          <div className="flex items-center gap-3">
            <div>
            </div>
          </div>
            </span>
            <span className="px-3 py-1 text-sm text-white/70">
              RANK #{rank}
            </span>
          </div>
        </div>
        <Divider className="bg-white/10" />

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

        {/* Total Points */}


        {/* Progress Bar */}
        <OverlappingProgressBars
          completionCurrent={entry.best_achievements_count}
          completionTotal={totalTracks}
          achievementsCurrent={0}
          achievementsTotal={0}
        />

      </div>
    </div>
  );
}