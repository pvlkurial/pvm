import { MappackTier } from "@/types/mappack.types";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  note: string;
  /**
   * Shown as a dot beside the value. Tier colours are picked in the editor and
   * can be too dark to read as text, so the value itself stays neutral.
   */
  swatch?: string;
}

function StatCard({ label, value, note, swatch }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <p className="eyebrow">{label}</p>
        <p className="mt-3 flex items-center gap-3 font-display text-display-m">
          {swatch && (
            <span
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: swatch }}
            />
          )}
          {value}
        </p>
        <p className="mt-2 text-small text-muted-foreground">{note}</p>
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
        label="Difficulty tier"
        value={tier?.name || "Unranked"}
        note={`${tier?.points || 0} points`}
        swatch={tier?.color}
      />
      <StatCard
        label="Records tracked"
        value={recordsCount.toLocaleString()}
        note="Records might not be fully updated"
      />
    </div>
  );
}
