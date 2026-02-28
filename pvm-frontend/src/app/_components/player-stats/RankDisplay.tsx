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

      {/* Current rank card */}
      <motion.div
        className="relative rounded-xl overflow-hidden px-4 py-4"
        style={{
          background: `linear-gradient(135deg, ${rank.color}18 0%, transparent 60%)`,
          boxShadow: `inset 0 0 0 1px ${rank.color}35`,
        }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {rank.backgroundGlow && (
          <div
            className="absolute inset-0 blur-2xl opacity-20 pointer-events-none"
            style={{ backgroundColor: rank.color }}
          />
        )}

        {/* Left color bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ backgroundColor: rank.color }}
        />

        <div className="relative z-10">
          <p className="text-neutral-600 text-[10px] tracking-widest uppercase mb-1.5">
            Current Rank
          </p>
          <p
            className="font-ruigslay leading-none"
            style={{ fontSize: "clamp(24px, 3vw, 34px)", color: rank.color }}
          >
            {rank.name}
          </p>
        </div>
      </motion.div>

      {/* Progress to next rank */}
      {nextRank && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-[10px] tracking-widest uppercase">
              Next: {nextRank.name}
            </span>
            <span className="text-white/40 text-[10px]">
              {pointsToNext.toLocaleString()} pts
            </span>
          </div>
          <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${nextRank.color}50, ${nextRank.color})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressToNext, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </div>
      )}

    </div>
  );
}