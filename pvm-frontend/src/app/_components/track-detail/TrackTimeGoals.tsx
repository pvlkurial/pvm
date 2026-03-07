import { millisecondsToTimeString } from "@/utils/time.utils";
import { TimeGoalCard } from "./TimeGoalCard";
import { Card, CardBody } from "@heroui/react";
import { FaTrophy } from "react-icons/fa6";

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
  const sortedTimeGoals = [...timeGoals].sort(
    (a, b) => (a.multiplier ?? 0) - (b.multiplier ?? 0)
  );

  return (
    <Card className="bg-transparent border border-white/10 relative overflow-hidden">
      <FaTrophy className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
      <CardBody className="p-6 relative z-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <FaTrophy className="w-4 h-4 text-white/50" />
          <p className="text-sm uppercase tracking-wider text-white/70 font-semibold">
            Time Goals
          </p>
          {hasPB && (
            <>
              <span className="text-white/20 text-xs">·</span>
              <span className="font-mono text-white/50 text-sm">{millisecondsToTimeString(personalBest)}</span>
            </>
          )}
        </div>

        {sortedTimeGoals.length > 0 ? (
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(sortedTimeGoals.length, 6)}, minmax(0, 1fr))` }}>
            {sortedTimeGoals.map((goal, index) => (
              <TimeGoalCard
                key={index}
                name={goal.name}
                time={goal.time}
                multiplier={goal.multiplier}
                personalBest={personalBest}
              />
            ))}
          </div>
        ) : (
          <p className="text-neutral-600 text-sm text-center py-6">
            No time goals set for this track
          </p>
        )}

      </CardBody>
    </Card>
  );
}