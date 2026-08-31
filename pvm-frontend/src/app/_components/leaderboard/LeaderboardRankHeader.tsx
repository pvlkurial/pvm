"use client";
import { Casko } from "@/fonts";
import { MappackRank } from "@/types/mappack.types";
import { glowOpacity, headingShadow } from "@/utils/rank-style.utils";

interface LeaderboardRankHeaderProps {
  rank: MappackRank;
}

export function LeaderboardRankHeader({
  rank,
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

    </div>
  );
}
