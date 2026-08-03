import { Input } from "@heroui/react";
import { TimeGoal } from "@/types/mappack.types";
import { SectionHeading } from "../SectionHeading";

interface TimeGoalsInputProps {
  timeGoals: TimeGoal[];
  timeGoalValues: Record<number, string>;
  onTimeGoalChange: (timeGoalId: number, value: string) => void;
  inputClassNames: any;
}

export function TimeGoalsInput({
  timeGoals,
  timeGoalValues,
  onTimeGoalChange,
  inputClassNames,
}: TimeGoalsInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <SectionHeading>Time Goals</SectionHeading>

      {(!timeGoals || timeGoals.length === 0) && (
        <p className="text-gray-400 italic text-center py-4">
          No time goals available. Add time goals to the mappack first.
        </p>
      )}

      {timeGoals &&
        timeGoals.map((timegoal) => (
          <Input
            key={timegoal.id}
            label={`${timegoal.name} (×${timegoal.multiplier})`}
            placeholder="1:03:942"
            variant="bordered"
            value={timeGoalValues[timegoal.id!] || ""}
            onValueChange={(value) => onTimeGoalChange(timegoal.id!, value)}
            classNames={inputClassNames}
            description="Format: MM:SS:mmm"
          />
        ))}
    </div>
  );
}