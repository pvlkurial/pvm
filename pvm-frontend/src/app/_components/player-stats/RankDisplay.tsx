"use client";
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
    <div className="group relative space-y-2">
      <p className="text-neutral-500 text-[10px] tracking-widest uppercase">current rank</p>
      <p
        className="font-ruigslay leading-none transition-all duration-300 origin-left group-hover:scale-[1.06] cursor-default"
        style={{
          fontSize: `clamp(${Math.max(13, 40 - rank.name.length * 3)}px, ${Math.max(1.4, 4 - rank.name.length * 0.25)}vw, ${Math.max(18, 56 - rank.name.length * 4)}px)`,
          color: rank.color,
          textShadow: `0 0 30px ${rank.color}60, 0 0 80px ${rank.color}30`,
        }}
      >
        {rank.name}
      </p>

      {nextRank && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-neutral-600 text-[10px] tracking-widest uppercase">
              Next: {nextRank.name}
            </span>
            <span className="text-neutral-600 text-[10px] font-mono">
              {pointsToNext.toLocaleString()} pts to go
            </span>
          </div>
          <div className="h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(to right, ${nextRank.color}30, ${nextRank.color})` }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressToNext, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            />
          </div>
        </div>
      )}

    </div>
  );
}