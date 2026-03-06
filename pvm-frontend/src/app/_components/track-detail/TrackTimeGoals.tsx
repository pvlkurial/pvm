// TrackTimeGoals.tsx
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
  const sortedTimeGoals = [...timeGoals].sort(
    (a, b) => (a.multiplier ?? 0) - (b.multiplier ?? 0)
  );

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr] items-center gap-3 mb-4">
        <div className="flex items-center gap-3">
          <p className="font-ruigslay text-white text-2xl">Time Goals</p>
          {hasPB && (
            <>
              <span className="text-neutral-700 text-sm">·</span>
              <span className="text-neutral-500 text-sm text-label">
                PB{" "}
                <span className="text-white text-label">
                  {millisecondsToTimeString(personalBest)}
                </span>
              </span>
            </>
          )}
        </div>
        <div className="h-[3px] bg-neutral-800" />
      </div>

      {sortedTimeGoals.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
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
    </div>
  );
}