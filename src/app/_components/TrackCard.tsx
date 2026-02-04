"use client";
import { Card, CardFooter, CardHeader, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toTimeFromMilliseconds } from "../_utils/converters";
import { FormattedText } from "../_utils/textConverter";

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
  time_goal_id: number;
  time: number;
  timeGoal?: TimeGoal;
}

interface Track {
  id: string;
  name: string;
  author: string;
  thumbnailUrl: string;
  dominantColor: string;
}

interface MappackTrack {
  mappack_id: string;
  track_id: string;
  track: Track;
  timeGoalMappackTrack: TimeGoalMappackTrack[];
  tier: Tier | null;
  mapStyle: string | null;
}

interface TrackCardProps {
  mappackTrack: MappackTrack;
  timeGoalDefinitions: TimeGoal[];
  mappackId: string;
}
const millisecondsToTimeString = (ms: number): string => {
  if (!ms || ms === 0) return "";
  
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
};

export default function TrackCard({
  mappackTrack,
  timeGoalDefinitions,
  mappackId,
}: TrackCardProps) {
  const router = useRouter();

  const getTimeGoalName = (timeGoalId: number) => {
    const definition = timeGoalDefinitions.find((def) => def.id === timeGoalId);
    return definition?.name || `Goal ${timeGoalId}`;
  };

  const { track, timeGoalMappackTrack } = mappackTrack;

  return (
    <Card
  className="h-50h group transition-transform hover:scale-105 duration-300 hover:z-20 transform-gpu overflow-hidden relative"
  shadow="sm"
  isPressable
  onPress={() => router.push(`${mappackId}/${track.id}`)}
>
  <CardHeader className="absolute z-10 top-1 flex-col items-center top-0 group-hover:bg-black/30 duration-300 justify-between">
    <h4 className="text-white text-xl">
      <FormattedText text={track.name} />
    </h4>
    <p className="text-white/30 text-sm">{track.author}</p>
  </CardHeader>
  <Image
    removeWrapper
    alt="Card background"
    className="z-0 w-full h-full object-cover"
    src={track.thumbnailUrl}
  />
  <CardFooter
    className="absolute bg-black/40 backdrop-blur-sm -bottom-1 left-0 right-0 border-t border-white/10 z-10
               translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out
               pb-3 pt-2"
  >
    <div className="w-full p-2">
      {timeGoalMappackTrack && timeGoalMappackTrack.length > 0 ? (
        <div className="flex gap-2 w-full">
          {timeGoalMappackTrack.map((timegoal) => {
            const isAchieved = false;
            
            return (
              <div
                key={timegoal.time_goal_id}
                className={`
                  flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-lg 
                  transition-all duration-200
                  ${isAchieved 
                    ? 'bg-green-500/20 border border-green-400/40 hover:bg-green-500/30' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }
                `}
              >
                <span 
                  className={`text-tiny font-semibold uppercase tracking-wide ${
                    isAchieved ? 'text-green-300' : 'text-white'
                  }`}
                >
                  {getTimeGoalName(timegoal.time_goal_id)}
                </span>
                <span 
                  className={`text-tiny font-mono font-medium ${
                    isAchieved ? 'text-green-200' : 'text-white/70'
                  }`}
                >
                  {millisecondsToTimeString(timegoal.time)}
                </span>
                {isAchieved && (
                  <span className="text-[10px] text-green-400 font-semibold">✓ Achieved</span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-white/50 text-tiny text-center py-2">No time goals set</p>
      )}
    </div>
  </CardFooter>
</Card>
  );
}