import { useState } from "react";
import { Switch, Tabs, Tab } from "@heroui/react";
import TrackFilter from "@/app/_components/TrackFilter";
import LeaderboardTab from "@/app/_components/LeaderboardTab";
import { TierSection } from "./TierSection";
import { Mappack, MappackTrack, MappackTier } from "@/types/mappack.types";
import { MappackProgressBar } from "./mappack-page/MappackProgressBar";
import { TierSortButton } from "./TierSortButton";

interface MappackContentProps {
  mappack: Mappack;
  sortedTiers: string[];
  tracksByTier: Record<string, { tier: MappackTier | null; tracks: MappackTrack[] }>;
  filteredTracks: MappackTrack[];
  onFilterChange: (tracks: MappackTrack[]) => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
  onTabChange: (tab: string) => void;
  tierRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  playerId?: string;
}

export function MappackContent({
  mappack,
  sortedTiers,
  tracksByTier,
  filteredTracks,
  onFilterChange,
  onSortOrderChange,
  onTabChange,
  tierRefs,
  playerId,
}: MappackContentProps) {
  const [alwaysShowTrackDetails, setAlwaysShowTrackDetails] = useState(true);
  const [selectedTab, setSelectedTab] = useState("maps");

  const handleTabChange = (key: string) => {
    setSelectedTab(key);
    onTabChange(key);
  };

  const completionCurrent = playerId 
    ? mappack.MappackTrack.reduce((total, track) => {
        const achievedCount = track.timeGoalMappackTrack?.filter(tg => tg.is_achieved).length || 0;
        return total + achievedCount;
      }, 0)
    : 0;

  const completionTotal = mappack.MappackTrack.reduce((total, track) => {
    return total + (track.timeGoalMappackTrack?.length || 0);
  }, 0);

  return (
    <div className="lg:col-start-2 lg:col-span-4 col-span-1">
      <div className="flex items-center gap-4 mb-4 pt-3">
        <TrackFilter
          timeGoals={mappack.timeGoals}
          tracks={mappack.MappackTrack}
          onFilterChange={onFilterChange}
        />
        <TierSortButton onSortOrderChange={onSortOrderChange} />
        <Switch
          isSelected={alwaysShowTrackDetails}
          onValueChange={setAlwaysShowTrackDetails}
          size="sm"
          classNames={{
            wrapper: "group-data-[selected=true]:bg-white bg-neutral-600",
          }}
        >
          <span className="text-sm text-white">Always Show Track Details</span>
        </Switch>
      </div>
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => handleTabChange(key as string)}
        size="lg"
        color="default"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-white/10",
          cursor: "w-full bg-white",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-white text-white/60 font-semibold text-lg",
        }}
        className="mb-6"
      >
        <Tab key="maps" title="Maps">
          {playerId && (
            <MappackProgressBar
              completionCurrent={completionCurrent}
              completionTotal={completionTotal}
            />
          )}
          <div className="flex flex-col gap-8">
            {sortedTiers.map((tierName) => {
              const tierData = tracksByTier[tierName];
              return (
                <TierSection
                  key={tierName}
                  tierName={tierName}
                  tierData={tierData}
                  timeGoals={mappack.timeGoals}
                  mappackId={mappack.id}
                  alwaysShowDetails={alwaysShowTrackDetails}
                  onRef={(el) => {
                    tierRefs.current[tierName] = el;
                  }}
                />
              );
            })}
          </div>
        </Tab>
        <Tab key="leaderboard" title="Leaderboard">
          <LeaderboardTab
            mappackId={mappack.id}
            mappackRanks={mappack.mappackRanks}
          />
        </Tab>
      </Tabs>
    </div>
  );
}