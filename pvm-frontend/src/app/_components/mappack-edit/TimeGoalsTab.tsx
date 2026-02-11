import { Button, Input } from "@heroui/react";
import { TimeGoal } from "@/types/mappack.types";

interface TimeGoalsTabProps {
  timeGoals: TimeGoal[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof TimeGoal, value: string | number) => void;
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
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <p className="text-xl font-ruigslay">Time Goals</p>
        <div className="flex-1 h-[5px] bg-neutral-300"></div>
      </div>
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
            color="danger"
            variant="flat"
            onPress={() => onRemove(timegoal.id)}
            isIconOnly
          >
            ✕
          </Button>
        </div>
      ))}
      <Button color="default" onPress={onAdd}>
        Add Time Goal
      </Button>
    </div>
  );
}