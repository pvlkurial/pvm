import { Input } from "@heroui/react";
import { TimeGoal } from "@/types/mappack.types";

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
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <p className="text-xl font-ruigslay">Time Goals</p>
        <div className="flex-1 h-[5px] bg-neutral-300"></div>
      </div>

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