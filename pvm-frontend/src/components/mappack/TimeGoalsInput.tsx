import { TimeGoal } from "@/types/mappack.types";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/common/SectionHeading";

interface TimeGoalsInputProps {
  timeGoals: TimeGoal[];
  timeGoalValues: Record<number, string>;
  onTimeGoalChange: (timeGoalId: number, value: string) => void;
}

export function TimeGoalsInput({
  timeGoals,
  timeGoalValues,
  onTimeGoalChange,
}: TimeGoalsInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeading>Time Goals</SectionHeading>

      {timeGoals.length === 0 && (
        <p className="py-4 text-center text-small text-muted-foreground italic">
          No time goals available. Add time goals to the mappack first.
        </p>
      )}

      {timeGoals.map((timegoal) => (
        <Field
          key={timegoal.id}
          label={`${timegoal.name} (×${timegoal.multiplier})`}
          description="Format: M:SS:mmm or M:SS.mmm"
        >
          <Input
            placeholder="1:03:942"
            value={timeGoalValues[timegoal.id!] || ""}
            onChange={(e) => onTimeGoalChange(timegoal.id!, e.target.value)}
          />
        </Field>
      ))}
    </div>
  );
}
