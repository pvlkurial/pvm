"use client";
import { useState } from "react";
import { Mappack, MappackTrack } from "@/types/mappack.types";
import { TracksByTier } from "@/utils/mappack.utils";
import { calculateCompletionStats } from "@/utils/player.utils";
import { useStoredState } from "@/hooks/useStoredState";
import { SwitchField } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompletionBar } from "@/components/common/CompletionBar";
import { LeaderboardTab } from "@/components/leaderboard/LeaderboardTab";
import { TrackFilter } from "./TrackFilter";
import { TierSortButton, SortOrder } from "./TierSortButton";
import { InfoButton } from "./InfoButton";
import { TierSection } from "./TierSection";

export type MappackTab = "maps" | "leaderboard";

interface MappackContentProps {
  mappack: Mappack;
  sortedTiers: string[];
  tracksByTier: TracksByTier;
  onFilterChange: (tracks: MappackTrack[]) => void;
  tierSortOrder: SortOrder;
  onTierSortOrderChange: (order: SortOrder) => void;
  selectedTab: MappackTab;
  onTabChange: (tab: MappackTab) => void;
  tierRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
  playerId?: string;
}

export function MappackContent({
  mappack,
  sortedTiers,
  tracksByTier,
  onFilterChange,
  tierSortOrder,
  onTierSortOrderChange,
  selectedTab,
  onTabChange,
  tierRefs,
  playerId,
}: MappackContentProps) {
  const [alwaysShowTrackDetails, setAlwaysShowTrackDetails] = useStoredState(
    "alwaysShowTrackDetails",
    true,
    (raw) => raw === "true",
  );
  // Once opened, the leaderboard stays mounted (just hidden) so switching tabs
  // keeps the players already loaded instead of fetching them again.
  const [leaderboardOpened, setLeaderboardOpened] = useState(selectedTab === "leaderboard");
  if (selectedTab === "leaderboard" && !leaderboardOpened) {
    setLeaderboardOpened(true);
  }

  return (
    <div className="col-span-1 lg:col-span-4 lg:col-start-2">
      <div className="mb-4 flex items-center gap-2 pt-3">
        <TrackFilter
          timeGoals={mappack.timeGoals}
          tracks={mappack.MappackTrack}
          onFilterChange={onFilterChange}
        />
        <TierSortButton order={tierSortOrder} onChange={onTierSortOrderChange} />
        <InfoButton />
        <SwitchField
          label="Details"
          checked={alwaysShowTrackDetails}
          onCheckedChange={setAlwaysShowTrackDetails}
          className="ml-2"
        />
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={(tab) => onTabChange(tab as MappackTab)}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="maps" className="h-9 px-5">
            Maps
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="h-9 px-5">
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="maps">
          {playerId && (
            <div className="mb-8">
              <CompletionBar {...calculateCompletionStats(mappack.MappackTrack)} />
            </div>
          )}
          <div className="flex flex-col gap-8">
            {sortedTiers.map((tierName) => (
              <TierSection
                key={tierName}
                tierName={tierName}
                tierData={tracksByTier[tierName]}
                timeGoals={mappack.timeGoals}
                mappackId={mappack.id}
                alwaysShowDetails={alwaysShowTrackDetails}
                onRef={(el) => {
                  tierRefs.current[tierName] = el;
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="leaderboard"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          {leaderboardOpened && (
            <LeaderboardTab
              mappackId={mappack.id}
              mappackRanks={mappack.mappackRanks}
              loggedInMappack={playerId ? mappack : undefined}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
