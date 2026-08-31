"use client";
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

interface LeaderboardPlayerCardProps {
  entry: LeaderboardEntry;
  rank: MappackRank;
  position: number;
  onSelect: (playerId: string, playerName: string) => void;
}

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

  const select = () => onSelect(entry.player_id, entry.player.name);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={select}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select();
        }
      }}
      className={`relative flex items-center gap-3 p-3 rounded-xl overflow-hidden cursor-pointer
        transition-all duration-200 hover:scale-[1.02] focus-visible:scale-[1.02] focus-visible:outline-none
        ${inverted ? "" : isTopThree ? "bg-white/[0.07]" : "bg-white/[0.03] hover:bg-white/[0.06]"}
        ${animationClass(rank.animationType)}`}
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
                isTopThree ? `${borderColor}35` : "rgba(255,255,255,0.06)"
              }`,
            }),
        boxShadow: inverted || isTopThree ? cardGlow(rank, color) : "none",
        backgroundImage: backgroundPattern(rank.backgroundPattern, color),
        backgroundSize: patternSize(rank.backgroundPattern),
        ...(inverted ? { filter: effects.filter, animation: effects.animation } : effects),
      }}
    >
      {rank.animationType === "shine" && (
        <div
          className={`absolute inset-0 pointer-events-none animate-rank-shine ${
            inverted ? "opacity-30" : "opacity-20"
          }`}
          style={{
            background:
              "linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)",
          }}
        />
      )}

      {/* Position leads, so the list reads top-down like a ranking. */}
      <span
        className={`relative z-10 font-ruigslay text-2xl leading-none tabular-nums shrink-0 w-10 text-center ${
          inverted ? "text-black/50" : "text-white/35"
        }`}
      >
        {position}
      </span>

      <p
        className={`relative z-10 flex-1 min-w-0 truncate leading-tight
          ${fontSizeClass(rank.fontSize)} ${fontWeightClass(rank.fontWeight)}
          ${inverted ? "text-black" : "text-white"}`}
        style={{ textShadow: textShadow(rank, color) }}
      >
        {entry.player.name}
      </p>

      <p
        className="relative z-10 font-ruigslay leading-none shrink-0 text-2xl tabular-nums"
        style={{
          color: inverted ? "#000" : color,
          textShadow: textShadow(rank, color),
        }}
      >
        {entry.total_points.toLocaleString()}
      </p>

      {!inverted && isTopThree && (
        <div
          className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${color}80, transparent)`,
          }}
        />
      )}
    </div>
  );
}
