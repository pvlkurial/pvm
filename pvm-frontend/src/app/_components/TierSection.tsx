import TrackCard from "@/app/_components/TrackCard";
import { MappackTrack, MappackTier, TimeGoal } from "@/types/mappack.types";

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
  const tierColor = tierData.tier?.color || "#6b7280";

  return (
    <div
      ref={onRef}
      data-tier={tierName}
      className="scroll-mt-4"
    >
      <hr className="divider" />
      <div className="mb-4 pt-4 justify-center items-center flex">
        <h2 className="text-3xl uppercase tracking-wider text-white/70 font-semibold justify-center uppercase" style={{ color: tierColor }}>
          {tierName.toUpperCase()} TIER
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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