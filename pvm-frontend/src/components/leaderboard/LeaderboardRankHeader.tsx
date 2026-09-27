import { MappackRank } from "@/types/mappack.types";
import { glowOpacity, headingShadow } from "@/utils/rank-style.utils";

export function LeaderboardRankHeader({ rank }: { rank: MappackRank }) {
  const color = rank.color || "#6b7280";

  return (
    <div className="relative mb-6 flex flex-col items-center pt-2">
      {rank.backgroundGlow && (
        <div
          className="pointer-events-none absolute top-0 h-16 w-64 blur-3xl"
          style={{ backgroundColor: color, opacity: glowOpacity(rank) * 0.25 }}
        />
      )}

      <h2
        className="relative text-center font-display text-[clamp(32px,5vw,56px)] leading-none"
        style={{ color, textShadow: headingShadow(rank, color) }}
      >
        {rank.symbolsAround} {rank.name} {rank.symbolsAround}
      </h2>
    </div>
  );
}
