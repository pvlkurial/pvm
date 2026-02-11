"use client";
import { Card, CardFooter, CardHeader, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
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
  is_achieved?: boolean;
  player_time?: number;
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
  personal_best?: number;
}

interface TrackCardProps {
  mappackTrack: MappackTrack;
  timeGoalDefinitions: TimeGoal[];
  mappackId: string;
  alwaysShowDetails?: boolean;
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
  alwaysShowDetails = false,
}: TrackCardProps) {
  const router = useRouter();

  const { track, timeGoalMappackTrack, personal_best } = mappackTrack;

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
      className="h-50h group transition-transform md:hover:scale-105 duration-300 hover:z-20 transform-gpu overflow-hidden relative"
      shadow="sm"
      isPressable
      onPress={() => router.push(`${mappackId}/${track.id}`)}
      
    >
      <CardHeader className="absolute z-10 top-0 w-full
    flex flex-col items-center justify-between
    bg-transparent
    group-hover:bg-black/30
    group-hover:backdrop-blur-sm
    transition-all duration-300">
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
            {!mappackTrack.personal_best ? "Map not played yet" : `PB: ${millisecondsToTimeString(mappackTrack.personal_best || 0)}`}
       </span>
          </div>


          {enrichedTimeGoals.length > 0 && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">
                  Goals {achievedCount}/{totalCount}
                </span>
                <div className="flex-1 h-1 mx-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 transition-all duration-500"
                    style={{ width: `${(achievedCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-1 flex-wrap" >
                {enrichedTimeGoals.map((timegoal) => {
                  const isAchieved = timegoal.is_achieved || false;
                  
                  return (
                    <div
                      key={timegoal.time_goal_id}
                      className={`
                        group/goal relative flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium
                        transition-all duration-200
                        ${isAchieved 
                          ? 'bg-green-500/30 text-green-300 border border-green-400/50' 
                          : 'bg-white/5 text-white/50 border border-white/10'
                        }
                      `}
                      
                    >
                      <span className="uppercase tracking-wide">
                        {timegoal.name}
                      </span>
                      
                      {isAchieved ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-white/20">○</span>
                      )}

                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 
                                    bg-black/80 text-white text-[10px] rounded whitespace-nowrap
                                    opacity-0 group-hover/goal:opacity-100 pointer-events-none
                                    transition-opacity duration-200">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-mono text-white/70">
                            {millisecondsToTimeString(timegoal.time)}
                          </span>
                          <span className="text-white/50 text-[9px]">
                            ×{timegoal.multiplier.toFixed(1)}
                          </span>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 
                                      border-4 border-transparent border-t-black/90" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {enrichedTimeGoals.length === 0 && (
            <p className="text-white/30 text-[10px] text-center py-1">No time goals</p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}