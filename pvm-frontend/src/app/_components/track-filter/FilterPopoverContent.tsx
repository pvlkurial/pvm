import { Button } from "@heroui/react";
import { TimeGoal, MappackTrack } from "@/types/mappack.types";
import { getNotAchievedCount } from "@/utils/track-filter.utils";

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
  const sortedTimeGoals = [...timeGoals].sort((a, b) => a.multiplier - b.multiplier);
  const selectedIndex = sortedTimeGoals.findIndex((tg) => tg.id === selectedTimeGoal);

  return (
    <div
      className="w-[380px] max-w-[90vw] bg-zinc-900 rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 16px 40px rgba(0,0,0,0.5)" }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <p className="font-ruigslay text-white text-2xl leading-none">Filter Tracks</p>
        <p className="text-neutral-500 text-xs tracking-widest uppercase mt-1.5">
          Show tracks you haven't achieved selected timegoal on
        </p>
      </div>

      <hr className="border-white/[0.06]" />

      {/* Vertical progression */}
      <div className="px-5 py-5">
        <div className="flex flex-col">
          {sortedTimeGoals.map((tg, i) => {
            const isSelected = tg.id === selectedTimeGoal;
            const isPast = selectedIndex >= 0 && i < selectedIndex;
            const isLast = i === sortedTimeGoals.length - 1;
            const notAchieved = getNotAchievedCount(tracks, tg.id!);

            return (
              <button
                key={tg.id}
                onClick={() => onToggleTimeGoal(tg.id!)}
                className="flex items-stretch gap-4 cursor-pointer group text-left"
              >
                {/* Dot + vertical line */}
                <div className="flex flex-col items-center shrink-0 w-4">
                  <div
                    className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all duration-200 mt-1 ${
                      isSelected
                        ? "bg-white border-white scale-110"
                        : isPast
                        ? "bg-white/30 border-white/30"
                        : "bg-zinc-900 border-white/20 group-hover:border-white/50"
                    }`}
                  />
                  {!isLast && (
                    <div
                      className={`w-px flex-1 mt-1 mb-1 transition-colors duration-200 ${
                        isPast || isSelected ? "bg-white/30" : "bg-white/[0.08]"
                      }`}
                    />
                  )}
                </div>

                {/* Label */}
                <div className={`pb-4 ${isLast ? "" : ""}`}>
                  <p className={`font-ruigslay text-base leading-tight transition-colors duration-200 ${
                    isSelected ? "text-white" : isPast ? "text-white/30" : "text-neutral-500 group-hover:text-neutral-300"
                  }`}>
                    {tg.name}
                  </p>
                  <p className={`text-[10px] mt-0.5 transition-colors duration-200 ${
                    isSelected ? "text-neutral-400" : "text-neutral-700"
                  }`}>
                    ×{tg.multiplier} · {notAchieved} left
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-white/[0.06]" />

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between gap-3">
        <Button
          size="sm"
          variant="light"
          onPress={onClear}
          className="text-neutral-500 hover:text-white px-3"
        >
          Clear
        </Button>
        <Button
          size="sm"
          onPress={onApply}
          isDisabled={selectedTimeGoal === null}
          className="bg-white text-black font-semibold px-5 disabled:opacity-30"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}