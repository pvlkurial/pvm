import { MappackTier } from "@/types/mappack.types";

interface TierHeadingProps {
  tierName: string;
  tier: MappackTier | null;
  trackCount: number;
}

/** Shared by the modal's list and tile views so tiers read the same in both. */
export function TierHeading({ tierName, tier, trackCount }: TierHeadingProps) {
  const color = tier?.color ?? "#6b7280";

  return (
    <div className="flex items-center gap-3 pb-2 border-b border-white/10">
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <h3
        className="text-sm font-bold uppercase tracking-wider"
        style={{ color }}
      >
        {tierName}
      </h3>
      {tier && (
        <span className="text-xs text-white/40">{tier.points} pts</span>
      )}
      <span className="ml-auto text-xs text-white/30">
        {trackCount} {trackCount === 1 ? "track" : "tracks"}
      </span>
    </div>
  );
}
