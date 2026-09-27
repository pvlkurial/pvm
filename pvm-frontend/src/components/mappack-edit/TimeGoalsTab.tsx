import { LuX } from "react-icons/lu";
import { TimeGoal } from "@/types/mappack.types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/common/SectionHeading";

interface TimeGoalsTabProps {
  timeGoals: TimeGoal[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof TimeGoal, value: string | number) => void;
  onRemove: (id: number | undefined) => void;
}

export function TimeGoalsTab({ timeGoals, onAdd, onUpdate, onRemove }: TimeGoalsTabProps) {
  return (
    <div className="space-y-4">
      <SectionHeading>Time Goals</SectionHeading>
      {timeGoals.map((timegoal, index) => (
        <div
          key={timegoal.id || `new-${index}`}
          className="flex items-end gap-2 rounded-xl border border-border-subtle bg-surface-2 p-3"
        >
          <Field label="Name" className="flex-1">
            <Input
              value={timegoal.name}
              onChange={(e) => onUpdate(index, "name", e.target.value)}
            />
          </Field>
          <Field label="Multiplier" className="w-32">
            <Input
              type="number"
              value={timegoal.multiplier.toString()}
              onChange={(e) => onUpdate(index, "multiplier", parseInt(e.target.value) || 1)}
            />
          </Field>
          <Button
            variant="destructive"
            size="icon"
            aria-label="Remove time goal"
            onClick={() => onRemove(timegoal.id)}
          >
            <LuX className="size-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={onAdd}>
        Add Time Goal
      </Button>
    </div>
  );
}
