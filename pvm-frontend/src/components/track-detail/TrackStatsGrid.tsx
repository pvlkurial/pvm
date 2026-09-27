import { MappackTier } from "@/types/mappack.types";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  note: string;
  tint?: string;
}

function StatCard({ label, value, note, tint }: StatCardProps) {
  return (
    <Card
      style={
        tint
          ? {
              backgroundColor: `color-mix(in srgb, ${tint} 7%, var(--surface-0))`,
              borderColor: `color-mix(in srgb, ${tint} 25%, var(--border))`,
            }
          : undefined
      }
    >
      <CardContent>
        <p className="eyebrow mb-3">{label}</p>
        <p className="font-display text-display-m">{value}</p>
        <p className="mt-1 text-small text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}

interface TrackStatsGridProps {
  tier: MappackTier | null;
  recordsCount: number;
}

export function TrackStatsGrid({ tier, recordsCount }: TrackStatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard
        label="Difficulty Tier"
        value={tier?.name || "Unranked"}
        note={`${tier?.points || 0} points`}
        tint={tier?.color}
      />
      <StatCard
        label="Records Tracked"
        value={recordsCount}
        note="Records might not be fully updated"
      />
    </div>
  );
}
