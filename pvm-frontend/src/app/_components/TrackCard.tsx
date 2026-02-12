"use client";
import { Card, CardFooter, CardHeader, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { FormattedText } from "@/utils/textConverter";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { MappackTrack, TimeGoal } from "@/types/mappack.types";
import { TrackCardGoals } from "./track-card/TrackCardGoals";
import { TrackCardTier } from "./track-card/TrackCardTier";

interface TrackCardProps {
  mappackTrack: MappackTrack;
  timeGoalDefinitions: TimeGoal[];
  mappackId: string;
  alwaysShowDetails?: boolean;
}

export default function TrackCard({
  mappackTrack,
  timeGoalDefinitions,
  mappackId,
  alwaysShowDetails = false,
}: TrackCardProps) {
  const router = useRouter();

  const { track, timeGoalMappackTrack, personal_best, tier } = mappackTrack;

  const enrichedTimeGoals = timeGoalMappackTrack
    .map((tgmt) => {
      const definition = timeGoalDefinitions.find((def) => def.id === tgmt.time_goal_id);
      return {
        ...tgmt,
        name: definition?.name || `Goal ${tgmt.time_goal_id}`,
        multiplier: definition?.multiplier || 0,
      };
    })
    .sort((a, b) => b.multiplier - a.multiplier);

  const achievedCount = enrichedTimeGoals.filter((tg) => tg.is_achieved).length;
  const totalCount = enrichedTimeGoals.length;

  return (
    <Card
      className="aspect-square h-50h group transition-transform md:hover:scale-105 duration-300 hover:z-20 transform-gpu overflow-hidden relative"
      shadow="sm"
      isPressable
      onPress={() => router.push(`${mappackId}/${track.id}`)}
    >
      <CardHeader className="absolute z-10 top-0 w-full flex flex-col items-center justify-between bg-transparent group-hover:bg-black/30 group-hover:backdrop-blur-sm transition-all duration-300">
        <h4 className="text-white text-xl">
          <FormattedText text={track.name} />
        </h4>
        <p className="text-white/30 text-sm">{track.author}</p>
        
        {/* Tier Badge */}
        
      </CardHeader>
      
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src={track.thumbnailUrl}
      />
      
      <CardFooter
        className={`
          absolute bg-black/40 backdrop-blur-sm -bottom-1 left-0 right-0 border-t border-white/10 z-10
          transition-transform duration-300 ease-in-out pb-2 pt-2
          ${alwaysShowDetails 
            ? 'translate-y-0' 
            : 'translate-y-full group-hover:translate-y-0'
          }
        `}
      >
        <div className="w-full flex flex-col gap-2 px-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">
              {!personal_best 
                ? "Map not played yet" 
                : `PB: ${millisecondsToTimeString(personal_best)}`
              }
            </span>
          </div>

          <TrackCardGoals
            enrichedTimeGoals={enrichedTimeGoals}
            achievedCount={achievedCount}
            totalCount={totalCount}
          />
        </div>
      </CardFooter>
    </Card>
  );
}