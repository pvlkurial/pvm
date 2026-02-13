// components/player-stats/RankDisplay.tsx
import { MappackRank } from "@/types/mappack.types";
import { motion } from "framer-motion";

interface RankDisplayProps {
  rank: MappackRank;
  nextRank?: MappackRank;
  currentPoints: number;
}

export function RankDisplay({ rank, nextRank, currentPoints }: RankDisplayProps) {
  const pointsToNext = nextRank ? nextRank.pointsNeeded - currentPoints : 0;
  const progressToNext = nextRank 
    ? ((currentPoints - rank.pointsNeeded) / (nextRank.pointsNeeded - rank.pointsNeeded)) * 100
    : 100;

  return (
    <div className="space-y-3">
      {/* Current Rank Card */}
      <motion.div
        className="relative p-4 rounded-lg overflow-hidden"
        style={{
          backgroundColor: `${rank.color}20`,
          borderColor: `${rank.color}80`,
          borderWidth: '2px',
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Rank styling effects */}
        {rank.backgroundGlow && (
          <div 
            className="absolute inset-0 blur-xl opacity-30"
            style={{ backgroundColor: rank.color }}
          />
        )}
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
              Current Rank
            </p>
            <h3 
              className="text-2xl font-bold"
              style={{ 
                color: rank.color,
                fontFamily: 'inherit',
              }}
            >
              {rank.name}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Progress to Next Rank */}
      {nextRank && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50">Next: {nextRank.name}</span>
            <span className="text-white/70 font-semibold">
              {pointsToNext} pts needed
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: nextRank.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressToNext, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}