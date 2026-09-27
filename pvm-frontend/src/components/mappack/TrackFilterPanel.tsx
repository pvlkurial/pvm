import { TimeGoal, MappackTrack } from "@/types/mappack.types";
import { getNotAchievedCount } from "@/utils/track-filter.utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TrackFilterPanelProps {
  timeGoals: TimeGoal[];
  tracks: MappackTrack[];
  selectedTimeGoal: number | null;
  onToggleTimeGoal: (id: number) => void;
  onApply: () => void;
  onClear: () => void;
}

/** The time goals as a vertical timeline, easiest at the top. */
export function TrackFilterPanel({
  timeGoals,
  tracks,
  selectedTimeGoal,
  onToggleTimeGoal,
  onApply,
  onClear,
}: TrackFilterPanelProps) {
  const sortedTimeGoals = [...timeGoals].sort(
    (a, b) => a.multiplier - b.multiplier,
  );
  const selectedIndex = sortedTimeGoals.findIndex(
    (tg) => tg.id === selectedTimeGoal,
  );

  return (
    <div>
      <div className="px-5 pt-5 pb-4">
        <p className="font-display text-title">Filter Tracks</p>
        <p className="mt-2 text-small text-muted-foreground">
          Show tracks you haven&apos;t achieved selected timegoal on
        </p>
      </div>

      <div className="border-y border-border-subtle px-5 py-5">
        {sortedTimeGoals.map((tg, i) => {
          const isSelected = tg.id === selectedTimeGoal;
          const isPast = selectedIndex >= 0 && i < selectedIndex;
          const isLast = i === sortedTimeGoals.length - 1;

          return (
            <button
              key={tg.id}
              type="button"
              onClick={() => onToggleTimeGoal(tg.id!)}
              className="group flex w-full cursor-pointer items-stretch gap-4 text-left"
            >
              <div className="flex w-4 shrink-0 flex-col items-center">
                <div
                  className={cn(
                    "mt-1 size-4 shrink-0 rounded-full border-2 transition-all duration-200",
                    isSelected
                      ? "scale-110 border-foreground bg-foreground"
                      : isPast
                        ? "border-muted-foreground bg-muted-foreground"
                        : "border-border bg-surface-1 group-hover:border-muted-foreground",
                  )}
                />
                {!isLast && (
                  <div
                    className={cn(
                      "my-1 w-px flex-1 transition-colors duration-200",
                      isPast || isSelected ? "bg-muted-foreground" : "bg-border",
                    )}
                  />
                )}
              </div>

              <div className="pb-4">
                <p
                  className={cn(
                    "font-display text-2xl leading-tight transition-colors duration-200",
                    isSelected
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {tg.name}
                </p>
                <p className="mt-0.5 font-mono text-mono-s text-faint">
                  ×{tg.multiplier} · {getNotAchievedCount(tracks, tg.id!)} left
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <Button size="sm" variant="ghost" onClick={onClear}>
          Clear
        </Button>
        <Button size="sm" onClick={onApply} disabled={selectedTimeGoal === null}>
          Apply
        </Button>
      </div>
    </div>
  );
}
