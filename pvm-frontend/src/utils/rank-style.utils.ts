import { MappackRank } from "@/types/mappack.types";

/**
 * Cosmetic styling derived from a rank's editor settings. Everything the ranks
 * editor exposes — colour, glow, border, pattern, card style, animation and
 * typography — is resolved here so the leaderboard just renders the result.
 */

/** 0–1, from the rank's 0–100 glow intensity. */
export function glowOpacity(rank: MappackRank): number {
  return Math.min(100, Math.max(0, rank.glowIntensity ?? 50)) / 100;
}

/** Appends an alpha channel to a hex colour, e.g. #ff0000 at 0.5 -> #ff000080. */
function withAlpha(color: string, opacity: number): string {
  const alpha = Math.round(Math.min(1, Math.max(0, opacity)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${color}${alpha}`;
}

export function backgroundPattern(pattern: string, color: string): string {
  switch (pattern) {
    case "dots":
      return `radial-gradient(circle, ${color}30 1px, transparent 1px)`;
    case "grid":
      return `linear-gradient(${color}20 1px, transparent 1px), linear-gradient(90deg, ${color}20 1px, transparent 1px)`;
    case "diagonal":
      return `repeating-linear-gradient(45deg, transparent, transparent 10px, ${color}15 10px, ${color}15 20px)`;
    default:
      return "none";
  }
}

export function patternSize(pattern: string): string {
  return pattern === "dots" || pattern === "grid" ? "20px 20px" : "auto";
}

export function cardStyleEffects(
  cardStyle: string,
  color: string,
): React.CSSProperties {
  switch (cardStyle) {
    case "metallic":
      return {
        background: `linear-gradient(135deg, ${color}dd 0%, ${color}aa 50%, ${color}dd 100%)`,
        filter: "brightness(1.1) contrast(1.1)",
      };
    case "holographic":
      return {
        background: `linear-gradient(135deg, ${color}dd, ${color}88, ${color}dd)`,
        backgroundSize: "200% 200%",
        // Keyframes live in globals.css: styled-jsx renames scoped keyframes,
        // which an inline animation property like this cannot resolve.
        animation: "rank-holographic 3s ease infinite",
      };
    case "neon":
      return {
        background: `${color}20`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}40`,
      };
    default:
      return {};
  }
}

export function animationClass(animationType: string): string {
  switch (animationType) {
    case "pulse":
      return "animate-pulse";
    case "shimmer":
      return "animate-rank-shimmer";
    // "shine" is drawn as a sweeping overlay rather than a class.
    default:
      return "";
  }
}

export function fontSizeClass(fontSize: string): string {
  switch (fontSize) {
    case "large":
      return "text-lg";
    case "xl":
      return "text-xl";
    default:
      return "text-base";
  }
}

export function fontWeightClass(fontWeight: string): string {
  switch (fontWeight) {
    case "bold":
      return "font-bold";
    case "black":
      return "font-black";
    default:
      return "font-semibold";
  }
}

export function textShadow(rank: MappackRank, color: string): string {
  if (!rank.textShadow) return "none";
  return `0 0 10px ${withAlpha(color, 0.5)}`;
}

export function headingShadow(rank: MappackRank, color: string): string {
  const opacity = glowOpacity(rank);
  if (!rank.textShadow) return `0 0 60px ${color}20`;
  return `0 0 40px ${withAlpha(color, opacity * 0.5)}, 0 0 80px ${withAlpha(
    color,
    opacity * 0.25,
  )}`;
}

export function cardGlow(rank: MappackRank, color: string): string {
  if (!rank.backgroundGlow) return "none";
  const opacity = glowOpacity(rank);
  return `0 0 ${20 * opacity}px ${withAlpha(color, opacity * 0.375)}`;
}
