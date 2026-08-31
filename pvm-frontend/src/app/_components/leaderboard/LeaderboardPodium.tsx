"use client";
import { MappackRank, LeaderboardEntry } from "@/types/mappack.types";

export interface PodiumPlace {
  entry: LeaderboardEntry;
  rank: MappackRank | null;
  position: number;
}

interface LeaderboardPodiumProps {
  places: PodiumPlace[];
  onSelect: (playerId: string, playerName: string) => void;
}

/** Plinth heights and display order, so first place sits centre and tallest. */
const PLINTH = {
  1: { height: "h-28", order: "order-2" },
  2: { height: "h-20", order: "order-1" },
  3: { height: "h-14", order: "order-3" },
} as const;

export function LeaderboardPodium({
  places,
  onSelect,
}: LeaderboardPodiumProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end mb-12">
      {places.map(({ entry, rank, position }) => {
        const color = rank?.color || "#6b7280";
        const plinth = PLINTH[position as 1 | 2 | 3] ?? PLINTH[3];
        const isFirst = position === 1;

        return (
          <div
            key={entry.player_id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(entry.player_id, entry.player.name)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(entry.player_id, entry.player.name);
              }
            }}
            className={`${plinth.order} flex flex-col items-center cursor-pointer group focus-visible:outline-none`}
          >
            <p
              className={`w-full truncate text-center font-semibold text-white group-hover:text-white transition-colors ${
                isFirst ? "text-base sm:text-lg" : "text-sm"
              }`}
            >
              {entry.player.name}
            </p>
            <p
              className="font-ruigslay leading-none mt-1 mb-2 tabular-nums"
              style={{ color, fontSize: isFirst ? "1.75rem" : "1.375rem" }}
            >
              {entry.total_points.toLocaleString()}
            </p>

            <div
              className={`${plinth.height} w-full rounded-t-lg flex items-start justify-center pt-2 transition-colors`}
              style={{
                background: `linear-gradient(to bottom, ${color}25, ${color}08)`,
                borderTop: `2px solid ${color}`,
              }}
            >
              <span
                className="font-ruigslay leading-none tabular-nums"
                style={{
                  color,
                  fontSize: isFirst ? "2.5rem" : "2rem",
                  opacity: 0.9,
                }}
              >
                {position}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
