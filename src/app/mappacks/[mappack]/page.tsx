"use client";
import React, { useState, useEffect, use, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import TrackCard from "@/app/_components/TrackCard";
import AddTrackModal from "@/app/_components/AddTrackModal";
import LeaderboardTab from "@/app/_components/LeaderboardTab";
import { Casko } from "@/fonts";
import { Button, Tabs, Tab, Switch } from "@heroui/react";
import { EditMappackModal } from "@/app/_components/EditMappackModal";
import RequireRole from "@/app/_components/RequireRole";
import TrackFilter from "@/app/_components/TrackFilter";

interface TimeGoal {
  id: number;
  name: string;
  multiplier: number;
}
interface Tier {
  id: number;
  mappack_id: string;
  name: string;
  points: number;
  color: string;
}

interface MappackRank {
  id: number;
  mappack_id: string;
  name: string;
  pointsNeeded: number;
  color: string;
  
  backgroundGlow: boolean;
  invertedColor: boolean;
  textShadow: boolean;
  glowIntensity: number;
  borderWidth: number;
  borderColor?: string | null;
  
  symbolsAround?: string | null;
  animationType: string;
  cardStyle: string;
  backgroundPattern: string;
  
  fontSize: string;
  fontWeight: string;
}

interface TimeGoalMappackTrack {
  time_goal_id: number;
  time: number;
  is_achieved?: boolean;
  player_time?: number;
}

interface MappackTrack {
  mappack_id: string;
  track_id: string;
  track: Track;
  timeGoalMappackTrack: TimeGoalMappackTrack[];
  tier: Tier | null;
  mapStyle: string;
  personal_best?: number;
}

interface Mappack {
  id: string;
  name: string;
  description: string;
  thumbnailURL: string;
  isActive: boolean;
  MappackTrack: MappackTrack[];
  timeGoals: TimeGoal[];
  mappackTiers: Tier[];
  mappackRanks: MappackRank[];
}

interface Track {
  id: string;
  name: string;
  author: string;
  authorName: string;
  thumbnailUrl: string;
  dominantColor: string;
}

export default function Mappack({
  params,
}: {
  params: Promise<{ mappack: string }>;
}) {
  const { mappack } = use(params);
  const { user } = useAuth();
  const [alwaysShowTrackDetails, setAlwaysShowTrackDetails] = useState(false);
  const [filteredTracks, setFilteredTracks] = useState<MappackTrack[]>([]);

  const [activeTier, setActiveTier] = useState<string>("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("maps");
  const tierRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [mappacks, setMappacks] = useState<Mappack | null>(null);
  
  useEffect(() => {
    let url = `http://localhost:8080/mappacks/${mappack}`;
    if (user?.id) {
      url += `?player_id=${user.id}`;
    }

    axios
      .get(url)
      .then((response) => {
      setMappacks(response.data);
      setFilteredTracks(response.data.MappackTrack);
    })
      .catch((err) => {
        console.log("Error details:", err.message, err.config);
      });
  }, [mappack, user?.id]);

const tracksByTier = filteredTracks?.reduce((acc, mappackTrack) => {
  const tierName = mappackTrack.tier?.name || "Unranked";
  if (!acc[tierName]) {
    acc[tierName] = {
      tier: mappackTrack.tier,
      tracks: [],
    };
  }
  acc[tierName].tracks.push(mappackTrack);
  return acc;
}, {} as Record<string, { tier: Tier | null; tracks: typeof filteredTracks }>);

  const sortedTiers = Object.keys(tracksByTier || {}).sort((a, b) => {
    const pointsA = tracksByTier[a].tier?.points || 0;
    const pointsB = tracksByTier[b].tier?.points || 0;
    return pointsA - pointsB;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTier(entry.target.getAttribute("data-tier") || "");
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    );

    Object.values(tierRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [tracksByTier]);

  const scrollToTier = (tier: string) => {
    tierRefs.current[tier]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="grid lg:grid-rows-1 lg:grid-cols-6 gap-10">
      <div className="lg:col-start-1 lg:col-span-1 col-span-1 bg-white-900 lg:sticky lg:top-4 lg:self-start">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-center items-center">
            <p className="font-bold text-3xl font-ruigslay overline">
              {mappacks?.name.toUpperCase()}
            </p>
          </div>
          <div className="flex justify-center items-center">
            <p className="font-bold text-sm ">{mappacks?.description}</p>
          </div>
          <hr></hr>
          <div className="flex justify-center items-center">
            <p className="text-lg font-ruigslay">Timegoals</p>
          </div>
          {mappacks?.timeGoals.map((timeGoal) => (
            <div
              key={timeGoal.name}
              className="flex justify-center items-center"
            >
              <p className="text-bold">{timeGoal.name}</p>
            </div>
          ))}

          {selectedTab === "maps" && (
            <>
              <div className="border-t border-gray-700 pt-4">
                <p className="font-semibold text-lg mb-2 text-center font-ruigslay">
                  Tiers
                </p>
                {sortedTiers.map((tierName) => {
                  const tierData = tracksByTier[tierName];
                  const tierColor = tierData.tier?.color || "#6b7280";

                  return (
                    <button
                      key={tierName}
                      onClick={() => scrollToTier(tierName)}
                      style={{
                        backgroundColor:
                          activeTier === tierName ? tierColor : "transparent",
                      }}
                      className={`w-full py-2 px-4 rounded-lg transition-all duration-200  ${
                        activeTier === tierName
                          ? "text-white font-semibold"
                          : "text-gray-300 hover:opacity-80"
                      }`}
                    >
                      {tierName.toUpperCase()} TIER ({tierData.tracks.length})
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center items-center">
                <RequireRole role="admin">
                <AddTrackModal
                  timegoals={mappacks?.timeGoals || []}
                  mappackId={mappacks?.id || ""}
                  tiers={mappacks?.mappackTiers || []}
                />
                </RequireRole>
              </div>
            </>
          )}

          <div className="flex justify-center items-center">
            <RequireRole role="admin">
            <Button onPress={() => setIsEditOpen(true)}>Edit Mappack</Button>
            <EditMappackModal
              mappack={mappacks}
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              onSave={() => {
                axios
                  .get(`http://localhost:8080/mappacks/${mappack}`)
                  .then((response) => setMappacks(response.data))
                  .catch((err) => console.log("Error reloading:", err));
              }}
            />
            </RequireRole>
          </div>
        </div>
      </div>

      <div className="lg:col-start-2 lg:col-span-4 col-span-1">
      <div className="flex items-center gap-4 mb-4 pt-3">  
        <TrackFilter
          timeGoals={mappacks?.timeGoals || []}
          tracks={mappacks?.MappackTrack || []}
          onFilterChange={setFilteredTracks}
          />
        <Switch
          isSelected={alwaysShowTrackDetails}
          onValueChange={setAlwaysShowTrackDetails}
          size="sm"
          classNames={{
            wrapper: "group-data-[selected=true]:bg-white bg-neutral-600",
          }}
        >
          <span className="text-sm text-white">
            Always Show Track Details
          </span>
        </Switch>
      </div>
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          size="lg"
          color="default"
          variant="underlined"
          classNames={{
            tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-white/10",
            cursor: "w-full bg-white",
            tab: "max-w-fit px-0 h-12",
            tabContent:
            "group-data-[selected=true]:text-white text-white/60 font-semibold text-lg",
          }}
          className="mb-6"
          >
          <Tab key="maps" title="Maps">
            <div className="flex flex-col gap-8">
              {sortedTiers.map((tierName) => {
                const tierData = tracksByTier[tierName];
                const tierColor = tierData.tier?.color || "#6b7280";
                return (
                  <div
                  key={tierName}
                  ref={(el) => {
                    tierRefs.current[tierName] = el;
                  }}
                  data-tier={tierName}
                  className="scroll-mt-4"
                  >
                      <hr className="border-1 border-white/10 my-2 w-full" />
                    <div className="mb-4 pt-4 justify-center items-center flex">
                      <h2
                        className={`text-3xl justify-center uppercase`}
                        style={{ color: tierColor }}
                        >
                        {tierName.toUpperCase()} TIER
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {tierData.tracks.map((mappackTrack) => (
                        <TrackCard
                        key={mappackTrack.track_id}
                        mappackTrack={mappackTrack}
                        timeGoalDefinitions={mappacks.timeGoals}
                        mappackId={mappacks.id}
                        alwaysShowDetails={alwaysShowTrackDetails}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Tab>

          <Tab key="leaderboard" title="Leaderboard">
            <LeaderboardTab
              mappackId={mappack}
              mappackRanks={mappacks?.mappackRanks || []}
              />
          </Tab>
        </Tabs>
        
      </div>
    </div>
  );
}