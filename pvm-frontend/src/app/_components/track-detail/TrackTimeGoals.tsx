import { Card, CardBody } from "@heroui/react";
import { FaTrophy, FaClock } from "react-icons/fa";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { TimeGoalCard } from "./TimeGoalCard";

interface TimeGoal {
  name: string;
  time: number;
  multiplier?: number;
}

interface TrackTimeGoalsProps {
  timeGoals: TimeGoal[];
  personalBest?: number;
}

export function TrackTimeGoals({ timeGoals, personalBest }: TrackTimeGoalsProps) {
  const hasPB = personalBest !== undefined && personalBest > 0;
  const sortedTimeGoals = [...timeGoals].sort((a, b) => {
    const multA = a.multiplier ?? 0;
    const multB = b.multiplier ?? 0;
    return multA - multB;
  });


  return (
    <Card className="bg-neutral-90 border border-blue-500/30 relative overflow-hidden">
      <div className="absolute inset-0 " />
      <FaTrophy className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40 text-white/10 opacity-30" />

      <CardBody className="p-4 relative z-10">
        {/* Header with inline PB */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <FaTrophy className="w-4 h-4 text-yellow-500/70" />
            <h3 className="text-sm uppercase tracking-wider text-white/70 font-semibold ">Time Goals</h3>
          </div>

          {hasPB && (
            <>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-sm uppercase tracking-wider text-white/70 font-semibold ">PB:</span>
                <span className="text-sm uppercase tracking-wider text-white/70 font-semibold">
                  {millisecondsToTimeString(personalBest)}
                </span>
              </div>
            </>
          )}
        </div>

        {sortedTimeGoals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {sortedTimeGoals.map((goal, index) => (
              <TimeGoalCard
                key={index}
                name={goal.name}
                time={goal.time}
                personalBest={personalBest}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-white/50 text-base">No time goals set for this track</p>
          </div>
        )}


      </CardBody>
    </Card>
  );
}