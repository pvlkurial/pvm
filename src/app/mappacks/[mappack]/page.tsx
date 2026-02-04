"use client";
import React, { useState, useEffect, use, useRef } from "react";
import axios from "axios";
import TrackCard from "@/app/_components/TrackCard";
import AddTrackModal from "@/app/_components/AddTrackModal";
import { Casko } from "@/fonts";
import { Button } from "@heroui/react";
import { EditMappackModal } from "@/app/_components/EditMappackModal";

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

interface TimeGoalMappackTrack {
  TimeGoalID: number;
  time: number;
}

interface MappackTrack {
  mappack_id: string;
  track_id: string;
  track: Track;
  TimeGoalMappackTrack: TimeGoalMappackTrack[];
  tier: Tier | null;
  mapStyle: string;
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
  const [activeTier, setActiveTier] = useState<string>("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const tierRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [mappacks, setMappacks] = useState<Mappack | null>(null);
  
  useEffect(() => {
    axios
      .get(`http://localhost:8080/mappacks/${mappack}`)
      .then((response) => setMappacks(response.data))
      .catch((err) => {
        console.log("Error details:", err.message, err.config);
      });
  }, []);

  const tracksByTier = mappacks?.MappackTrack.reduce((acc, mappackTrack) => {
    const tierName = mappackTrack.tier?.name || "Unranked";
    if (!acc[tierName]) {
      acc[tierName] = {
        tier: mappackTrack.tier,
        tracks: [],
      };
    }
    acc[tierName].tracks.push(mappackTrack);
    return acc;
  }, {} as Record<string, { tier: Tier | null; tracks: typeof mappacks.MappackTrack }>);

  const sortedTiers = Object.keys(tracksByTier || {}).sort((a, b) => {
    const pointsA = tracksByTier[a].tier?.points || 0;
    const pointsB = tracksByTier[b].tier?.points || 0;
    return pointsB - pointsA;
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
                      activeTier === tierName
                        ? tierColor
                        : "transparent",
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
            <AddTrackModal
              timegoals={mappacks?.timeGoals || []}
              mappackId={mappacks?.id || ""}
              tiers={mappacks?.mappackTiers || []}
            />
          </div>
          <div className="flex justify-center items-center">
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
          </div>
        </div>
      </div>
      <div className="lg:col-start-2 lg:col-span-4 col-span-1">
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
                <div className="mb-4 pt-4 justify-center items-center flex">
                  <h2
                    className={`text-3xl justify-center ${Casko.className} underline`}
                    style={{ color: tierColor }}
                  >
                    {tierName.toUpperCase()} TIER
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tierData.tracks.map((mappackTrack) => (
                    <TrackCard
                      key={mappackTrack.track_id}
                      mappackTrack={mappackTrack}
                      timeGoalDefinitions={mappacks.timeGoals}
                      mappackId={mappacks.id}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}