import Image from "next/image";
import { cn } from "@/lib/utils";

const STYLE_LABELS: Record<string, string> = {
  tech: "Tech",
  fullspeed: "Fullspeed",
  mixed: "Mixed",
  dirt: "Dirt",
  rpg: "RPG",
  trial: "Trial",
  lol: "LOL",
  ice: "Ice",
  pathfinding: "Pathfinding",
};

/** Styles with an icon in /public/map-styles. */
export function hasMapStyleIcon(styleKey: string): boolean {
  return styleKey.toLowerCase() in STYLE_LABELS;
}

export function getMapStyleLabel(styleKey: string): string {
  return STYLE_LABELS[styleKey.toLowerCase()] ?? styleKey;
}

interface MapStyleIconProps {
  styleKey: string;
  size?: number;
  className?: string;
}

export function MapStyleIcon({ styleKey, size = 32, className }: MapStyleIconProps) {
  if (!hasMapStyleIcon(styleKey)) return null;

  return (
    <Image
      src={`/map-styles/${styleKey.toLowerCase()}.svg`}
      alt={getMapStyleLabel(styleKey)}
      width={size}
      height={size}
      unoptimized
      className={cn("block", className)}
    />
  );
}
