import { IoDiamond } from "react-icons/io5";
import { FaDatabase } from "react-icons/fa";
import { MappackTier } from "@/types/mappack.types";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  note: string;
  tint?: string;
}

function StatCard({ icon, label, value, note, tint }: StatCardProps) {
  return (
    <Card style={tint ? { backgroundColor: `${tint}1a` } : undefined}>
      <div className="absolute -right-6 -bottom-6 text-foreground/5 [&>svg]:size-36 [&>svg]:rotate-12">
        {icon}
      </div>
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
        icon={<IoDiamond />}
        label="Difficulty Tier"
        value={tier?.name || "Unranked"}
        note={`${tier?.points || 0} points`}
        tint={tier?.color}
      />
      <StatCard
        icon={<FaDatabase />}
        label="Records Tracked"
        value={recordsCount}
        note="Records might not be fully updated"
      />
    </div>
  );
}
