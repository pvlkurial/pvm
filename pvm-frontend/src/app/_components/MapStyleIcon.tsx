// OPTION A — SVGs in /public/map-styles/*.svg
// No config changes needed. Color control via opacity/filter in CSS.
// Usage: place files like /public/map-styles/tech.svg

import React from "react";
import Image from "next/image";

interface Props {
  styleKey: string;
  className?: string;
}

const STYLE_LABELS: Record<string, string> = {
  tech:      "Tech",
  fullspeed: "Fullspeed",
  mixed:     "Mixed",
  dirt:      "Dirt",
  rpg:       "RPG",
  trial:     "Trial",
  lol:        "LOL",
  ice:       "Ice",
  pathfinding: "Pathfinding",
};

// Keys that have an SVG file ready — add to this list as you drop files in
const AVAILABLE = new Set(["tech", "mixed", "rpg", "fullspeed", "trial", "dirt", "pathfinding", "lol"]);

export default function MapStyleIcon({ styleKey, className = "" }: Props) {
  const key = styleKey.toLowerCase();
  if (!AVAILABLE.has(key)) return null;

  const label = STYLE_LABELS[key] ?? styleKey;

  return (
    <span className={`map-style-icon ${className}`}>
      <Image
        src={`/map-styles/${key}.svg`}
        alt={label}
        width={68}
        height={68}
        className="mp-style-svg"
      />
      <span className="mp-style-label">{label}</span>
    </span>
  );
}