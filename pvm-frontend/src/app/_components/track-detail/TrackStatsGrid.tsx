import { Card, CardBody } from "@heroui/react";
import { IoDiamond } from "react-icons/io5";
import { FaDatabase } from "react-icons/fa";
import { MappackTier } from "@/types/mappack.types";

interface TrackStatsGridProps {
  tier: MappackTier | null;
  recordsCount: number;
  dominantColor: string;
}

export function TrackStatsGrid({ tier, recordsCount, dominantColor }: TrackStatsGridProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Tier Card */}
      <Card
        className="relative overflow-hidden border-2"
        style={{
          borderColor: `${tier?.color || "#666"}40`,
          background: `linear-gradient(135deg, #${dominantColor}20, ${tier?.color || "#666"}20)`,
        }}
      >
        <IoDiamond className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 rotate-45" />
        <CardBody className="p-6 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <IoDiamond className="w-5 h-5 opacity-70" />
            <p className="text-sm uppercase tracking-wider text-white/70 font-semibold">
              Difficulty Tier
            </p>
          </div>
          <h2 className="text-4xl font-bold font-ruigslay">
            {tier?.name || "Unranked"}
          </h2>
          <p className="text-sm text-white/50 mt-1">
            {tier?.points || 0} points
          </p>
        </CardBody>
      </Card>

      {/* Records Card */}
      <Card className="bg-black-90 border border-blue-500/30 relative overflow-hidden">
        <FaDatabase className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 opacity-30" />
        <CardBody className="p-6 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <FaDatabase className="w-4 h-4 opacity-70" />
            <p className="text-sm uppercase tracking-wider text-white/70 font-semibold">
              Records Tracked
            </p>
          </div>
          <h2 className="text-4xl font-bold font-ruigslay">
            {recordsCount}
          </h2>
          <p className="text-sm text-white/50 mt-1">Records might not be fully updated</p>
        </CardBody>
      </Card>
    </div>
  );
}