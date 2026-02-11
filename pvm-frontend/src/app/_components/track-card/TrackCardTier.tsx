import { MappackTier } from "@/types/mappack.types";

interface TrackCardTierProps {
  tier: MappackTier;
}

export function TrackCardTier({ tier }: TrackCardTierProps) {
  return (
    <div 
      className="mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
      style={{
        backgroundColor: `${tier.color}40`,
        borderColor: tier.color,
        color: tier.color,
        borderWidth: '1px',
      }}
    >
      {tier.name} Tier
    </div>
  );
}