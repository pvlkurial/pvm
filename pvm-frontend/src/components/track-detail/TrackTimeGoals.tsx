import type { CSSProperties } from "react";
import { Track } from "@/types/mappack.types";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { Card, CardContent } from "@/components/ui/card";
import { TimeGoalCard } from "./TimeGoalCard";

interface TrackTimeGoalsProps {
  timeGoals: Track["timegoals"];
  personalBest?: number;
}

export function TrackTimeGoals({ timeGoals, personalBest }: TrackTimeGoalsProps) {
  const sortedTimeGoals = [...timeGoals].sort(
    (a, b) => (a.multiplier ?? 0) - (b.multiplier ?? 0),
  );

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <p className="eyebrow">Time goals</p>
          {!!personalBest && (
            <p className="text-small text-muted-foreground">
              PB{" "}
              <span className="tabular-nums text-foreground">
                {millisecondsToTimeString(personalBest)}
              </span>
            </p>
          )}
        </div>

        {sortedTimeGoals.length > 0 ? (
          // One goal per row on phones. The column count depends on how many
          // goals there are, so it rides in on a custom property: an inline
          // grid-template-columns would apply at every width and squeeze the
          // cards into slivers on a narrow screen.
          <div
            className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:[grid-template-columns:repeat(var(--goal-columns),minmax(0,1fr))]"
            style={
              { "--goal-columns": Math.min(sortedTimeGoals.length, 6) } as CSSProperties
            }
          >
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
          <p className="py-6 text-center text-small text-muted-foreground">
            No time goals set for this track
          </p>
        )}
      </CardContent>
    </Card>
  );
}
