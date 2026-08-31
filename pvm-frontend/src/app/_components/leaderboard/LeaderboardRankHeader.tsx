"use client";
import { Casko } from "@/fonts";
import { MappackRank } from "@/types/mappack.types";
import { glowOpacity, headingShadow } from "@/utils/rank-style.utils";

interface LeaderboardRankHeaderProps {
  rank: MappackRank;
  playerCount: number;
}

export function LeaderboardRankHeader({
  rank,
  playerCount,
}: LeaderboardRankHeaderProps) {
  const color = rank.color || "#6b7280";

  return (
    <div className="relative flex flex-col items-center mb-6 pt-2">
      {rank.backgroundGlow && (
        <div
          className="absolute top-0 blur-3xl w-64 h-16 pointer-events-none"
          style={{ backgroundColor: color, opacity: glowOpacity(rank) * 0.25 }}
        />
      )}

      <h2
        className={`relative text-center ${Casko.className}`}
        style={{
          fontSize: "clamp(32px, 5vw, 56px)",
          letterSpacing: "0.08em",
          color,
          textShadow: headingShadow(rank, color),
        }}
      >
        {rank.symbolsAround} {rank.name.toUpperCase()} {rank.symbolsAround}
      </h2>

      <div className="flex items-center gap-3 mt-2 w-full max-w-xs">
        <div
          className="flex-1 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${color}40)`,
          }}
        />
        <span className="text-[10px] tracking-widest uppercase text-white/25 tabular-nums">
          {playerCount}
        </span>
        <div
          className="flex-1 h-px"
          style={{
            background: `linear-gradient(to left, transparent, ${color}40)`,
          }}
        />
      </div>
    </div>
  );
}
