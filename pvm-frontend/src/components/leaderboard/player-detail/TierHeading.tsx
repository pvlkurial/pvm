import { MappackTier } from "@/types/mappack.types";

interface TierHeadingProps {
  tierName: string;
  tier: MappackTier | null;
}

/** Shared by the dialog's list and tile views so tiers read the same in both. */
export function TierHeading({ tierName, tier }: TierHeadingProps) {
  return (
    <h3 className="flex items-baseline gap-2">
      <span
        className="font-display text-2xl uppercase"
        style={{ color: tier?.color ?? "var(--text-muted)" }}
      >
        {tierName}
      </span>
      {tier && (
        <span className="font-mono text-mono-s text-faint">{tier.points} pts</span>
      )}
    </h3>
  );
}
