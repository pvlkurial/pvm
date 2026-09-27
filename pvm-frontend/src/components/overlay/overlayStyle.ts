/** Look of the track overlay, set once through its URL. */
export interface OverlayStyle {
  side: "left" | "right";
  bgOpacity: number;
  accentColor: string;
  scale: number;
}

export interface OverlayStyleParams {
  side?: "left" | "right";
  opacity?: string;
  accent?: string;
  scale?: string;
}

export function parseOverlayStyle(params: OverlayStyleParams): OverlayStyle {
  const { side = "right", opacity, accent, scale } = params;
  return {
    side,
    bgOpacity: opacity ? Math.min(100, Math.max(0, Number(opacity))) / 100 : 0.75,
    accentColor: accent && accent !== "base" ? `#${accent}` : "#4ade80",
    scale: scale ? Number(scale) : 1,
  };
}
