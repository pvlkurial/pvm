import { MappackRank, LeaderboardEntry } from "@/types/mappack.types";
import { cn } from "@/lib/utils";

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

export function LeaderboardPodium({ places, onSelect }: LeaderboardPodiumProps) {
  return (
    <div className="mb-12 grid grid-cols-3 items-end gap-2 sm:gap-4">
      {places.map(({ entry, rank, position }) => {
        const color = rank?.color || "#6b7280";
        const plinth = PLINTH[position as 1 | 2 | 3] ?? PLINTH[3];
        const isFirst = position === 1;

        return (
          <button
            key={entry.player_id}
            type="button"
            onClick={() => onSelect(entry.player_id, entry.player.name)}
            className={cn(plinth.order, "group flex cursor-pointer flex-col items-center outline-none")}
          >
            <span
              className={cn(
                "w-full truncate text-center font-medium text-foreground",
                isFirst ? "text-body-l" : "text-small",
              )}
            >
              {entry.player.name}
            </span>
            <span
              className={cn(
                "mt-1 mb-2 font-display leading-none tabular-nums",
                isFirst ? "text-[1.75rem]" : "text-[1.375rem]",
              )}
              style={{ color }}
            >
              {entry.total_points.toLocaleString()}
            </span>

            <span
              className={cn(plinth.height, "flex w-full items-start justify-center rounded-t-lg pt-2")}
              style={{ backgroundColor: `${color}14`, borderTop: `2px solid ${color}` }}
            >
              <span
                className={cn(
                  "font-display leading-none tabular-nums",
                  isFirst ? "text-[2.5rem]" : "text-[2rem]",
                )}
                style={{ color }}
              >
                {position}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
