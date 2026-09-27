import { MappackRank, LeaderboardEntry } from "@/types/mappack.types";
import {
  animationClass,
  backgroundPattern,
  cardGlow,
  cardStyleEffects,
  fontSizeClass,
  fontWeightClass,
  patternSize,
  textShadow,
} from "@/utils/rank-style.utils";
import { cn } from "@/lib/utils";

interface LeaderboardPlayerCardProps {
  entry: LeaderboardEntry;
  rank: MappackRank;
  position: number;
  onSelect: (playerId: string, playerName: string) => void;
}

/**
 * One player on the leaderboard. Its look comes from the rank's cosmetics as
 * configured in the ranks editor.
 */
export function LeaderboardPlayerCard({
  entry,
  rank,
  position,
  onSelect,
}: LeaderboardPlayerCardProps) {
  const color = rank.color || "#6b7280";
  const borderColor = rank.borderColor || color;
  const isTopThree = position <= 3;

  // The inverted variant fills the card with the rank colour and flips the text
  // to black; everything else about the two is identical.
  const inverted = rank.invertedColor;
  const effects = cardStyleEffects(rank.cardStyle, color);

  return (
    <button
      type="button"
      onClick={() => onSelect(entry.player_id, entry.player.name)}
      className={cn(
        "relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl p-3 text-left outline-none transition-all duration-200 hover:scale-[1.02] focus-visible:scale-[1.02]",
        !inverted && (isTopThree ? "bg-surface-2" : "bg-surface-1 hover:bg-surface-2"),
        animationClass(rank.animationType),
      )}
      style={{
        ...(inverted
          ? {
              background:
                effects.background ??
                `linear-gradient(135deg, ${color}dd, ${color}aa)`,
              border: `${rank.borderWidth || 2}px solid ${borderColor}`,
            }
          : {
              border: `${rank.borderWidth || 1}px solid ${
                isTopThree ? `${borderColor}35` : "var(--border)"
              }`,
            }),
        boxShadow: inverted || isTopThree ? cardGlow(rank, color) : "none",
        backgroundImage: backgroundPattern(rank.backgroundPattern, color),
        backgroundSize: patternSize(rank.backgroundPattern),
        ...(inverted ? { filter: effects.filter, animation: effects.animation } : effects),
      }}
    >
      {rank.animationType === "shine" && (
        <span
          className={cn(
            "animate-rank-shine pointer-events-none absolute inset-0",
            inverted ? "opacity-30" : "opacity-20",
          )}
          style={{
            background:
              "linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)",
          }}
        />
      )}

      {/* Position leads, so the list reads top-down like a ranking. */}
      <span
        className={cn(
          "relative z-10 w-10 shrink-0 text-center tabular-nums text-caption tabular-nums",
          inverted ? "text-black/50" : "text-faint",
        )}
      >
        {position}
      </span>

      <span
        className={cn(
          "relative z-10 min-w-0 flex-1 truncate leading-tight",
          fontSizeClass(rank.fontSize),
          fontWeightClass(rank.fontWeight),
          inverted ? "text-black" : "text-foreground",
        )}
        style={{ textShadow: textShadow(rank, color) }}
      >
        {entry.player.name}
      </span>

      <span
        className="relative z-10 shrink-0 font-display text-2xl leading-none tabular-nums"
        style={{
          color: inverted ? "#000" : color,
          textShadow: textShadow(rank, color),
        }}
      >
        {entry.total_points.toLocaleString()}
      </span>
    </button>
  );
}
