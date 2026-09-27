import { FaTrophy } from "react-icons/fa6";
import { cn } from "@/lib/utils";

const MEDAL_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

/** The player's leaderboard position on this track, shown only inside the top ten. */
export function TrackCardRank({ position }: { position: number }) {
  if (position > 10) return null;

  const medalColor = MEDAL_COLORS[position];

  return (
    <div
      className={cn(
        "absolute top-0 right-0 z-20 flex items-center gap-1 rounded-bl-xl bg-black/50 px-3 py-1.5 backdrop-blur-md",
        !medalColor && "text-muted-foreground",
      )}
      style={medalColor ? { color: medalColor } : undefined}
    >
      {medalColor && <FaTrophy className="size-3 shrink-0" />}
      <span className="font-mono text-mono-s">
        {position === 1 ? "WR" : `#${position}`}
      </span>
    </div>
  );
}
