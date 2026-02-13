import { Button } from "@heroui/react";
import { TimeGoal, MappackTrack } from "@/types/mappack.types";
import { getNotAchievedCount } from "@/utils/track-filter.utils";
import { TimeGoalOption } from "./TimeGoalOption";

interface FilterPopoverContentProps {
  timeGoals: TimeGoal[];
  tracks: MappackTrack[];
  selectedTimeGoal: number | null;
  onToggleTimeGoal: (id: number) => void;
  onApply: () => void;
  onClear: () => void;
}

export function FilterPopoverContent({
  timeGoals,
  tracks,
  selectedTimeGoal,
  onToggleTimeGoal,
  onApply,
  onClear,
}: FilterPopoverContentProps) {
  const sortedTimeGoals = [...timeGoals].sort((a, b) => b.multiplier - a.multiplier);

  return (
    <div className="w-[400px] max-w-[90vw]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800">
        <h3 className="text-base font-bold text-white">Filter Tracks</h3>
        <p className="text-xs text-zinc-500 mt-1">
          Show only unachieved time goals
        </p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
        <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
          Select Time Goal
        </p>
        <div className="flex flex-col gap-2">
          {sortedTimeGoals.map((timeGoal) => {
            const notAchieved = getNotAchievedCount(tracks, timeGoal.id!);
            const isSelected = selectedTimeGoal === timeGoal.id;
            return (
              <TimeGoalOption
                key={timeGoal.id}
                timeGoal={timeGoal}
                notAchievedCount={notAchieved}
                isSelected={isSelected}
                onClick={() => onToggleTimeGoal(timeGoal.id!)}
              />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-800 flex justify-between items-center">
        <Button
          size="sm"
          variant="light"
          onPress={onClear}
          className="text-zinc-400 hover:text-white"
        >
          Clear
        </Button>
        <Button
          size="sm"
          onPress={onApply}
          className="bg-orange-500 hover:bg-orange-600 text-white"
          isDisabled={selectedTimeGoal === null}
        >
          Apply Filter
        </Button>
      </div>
    </div>
  );
}