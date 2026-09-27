import { MappackTrack, MappackTier, TimeGoal } from "@/types/mappack.types";
import { TrackCard } from "@/components/track-card/TrackCard";

interface TierSectionProps {
  tierName: string;
  tierData: { tier: MappackTier | null; tracks: MappackTrack[] };
  timeGoals: TimeGoal[];
  mappackId: string;
  alwaysShowDetails: boolean;
  onRef: (el: HTMLDivElement | null) => void;
}

export function TierSection({
  tierName,
  tierData,
  timeGoals,
  mappackId,
  alwaysShowDetails,
  onRef,
}: TierSectionProps) {
  return (
    <div
      ref={onRef}
      data-tier={tierName}
      className="scroll-mt-4 border-t border-border pt-4"
    >
      <h2
        className="mb-4 text-center font-display text-display-m uppercase"
        style={{ color: tierData.tier?.color || "#6b7280" }}
      >
        {tierName} Tier
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {tierData.tracks.map((mappackTrack) => (
          <TrackCard
            key={mappackTrack.track_id}
            mappackTrack={mappackTrack}
            timeGoalDefinitions={timeGoals}
            mappackId={mappackId}
            alwaysShowDetails={alwaysShowDetails}
          />
        ))}
      </div>
    </div>
  );
}
