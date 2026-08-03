import { MappackTier } from "@/types/mappack.types";

interface TierHeadingProps {
  tierName: string;
  tier: MappackTier | null;
}

/** Shared by the modal's list and tile views so tiers read the same in both. */
export function TierHeading({ tierName, tier }: TierHeadingProps) {
  const color = tier?.color ?? "#9ca3af";

  return (
    <h3 className="text-base font-semibold uppercase" style={{ color }}>
      {tierName}
      {tier && (
        <span className="text-white/40 font-normal normal-case ml-2 text-sm">
          {tier.points} pts
        </span>
      )}
    </h3>
  );
}
