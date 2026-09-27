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
        className="text-lg font-bold tracking-wider uppercase"
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
