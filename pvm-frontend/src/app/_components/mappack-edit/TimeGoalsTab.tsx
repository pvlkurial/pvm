import { Button, Input } from "@heroui/react";
import { TimeGoal } from "@/types/mappack.types";
import { ADMIN_BUTTON, ADMIN_BUTTON_DANGER } from "@/constants/button-styles";
import { SectionHeading } from "@/app/_components/SectionHeading";

interface TimeGoalsTabProps {
  timeGoals: TimeGoal[];
  onAdd: () => void;
  onUpdate: (
    index: number,
    field: keyof TimeGoal,
    value: string | number,
  ) => void;
  onRemove: (id: number | undefined) => void;
  inputClassNames: any;
}

export function TimeGoalsTab({
  timeGoals,
  onAdd,
  onUpdate,
  onRemove,
  inputClassNames,
}: TimeGoalsTabProps) {
  return (
    <div className="space-y-4">
      <SectionHeading>Time Goals</SectionHeading>
      {timeGoals.map((timegoal, index) => (
        <div
          key={timegoal.id || `new-${index}`}
          className="flex gap-2 items-center bg-neutral-800 p-3 rounded-lg"
        >
          <Input
            label="Name"
            variant="bordered"
            value={timegoal.name}
            onValueChange={(value) => onUpdate(index, "name", value)}
            className="flex-1"
            classNames={inputClassNames}
          />
          <Input
            label="Multiplier"
            type="number"
            variant="bordered"
            value={timegoal.multiplier.toString()}
            onValueChange={(value) =>
              onUpdate(index, "multiplier", parseInt(value) || 1)
            }
            className="w-32"
            classNames={inputClassNames}
          />
          <Button
            size="sm"
            className={ADMIN_BUTTON_DANGER}
            onPress={() => onRemove(timegoal.id)}
            isIconOnly
          >
            ✕
          </Button>
        </div>
      ))}
      <Button className={ADMIN_BUTTON} onPress={onAdd}>
        Add Time Goal
      </Button>
    </div>
  );
}
