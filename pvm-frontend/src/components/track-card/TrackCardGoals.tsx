import { millisecondsToTimeString } from "@/utils/time.utils";
import { EnrichedTimeGoal } from "@/utils/player.utils";
import { cn } from "@/lib/utils";

/**
 * The goals as a segmented bar, one segment per goal, so the footer keeps the
 * same height however many goals a mappack has. Hovering a segment shows the
 * goal's name and time.
 */
export function TrackCardGoals({ timeGoals }: { timeGoals: EnrichedTimeGoal[] }) {
  if (timeGoals.length === 0) {
    return <p className="py-1 text-center text-[10px] text-faint">No time goals</p>;
  }

  const achievedCount = timeGoals.filter((tg) => tg.is_achieved).length;

  return (
    <div className="flex flex-col gap-1 pb-1.5">
      <span className="text-[11px] text-muted-foreground">
        Timegoals {achievedCount}/{timeGoals.length}
      </span>
      <div className="flex gap-0.5">
        {timeGoals.map((timegoal) => (
          <div
            key={timegoal.time_goal_id}
            // The bar itself is only a few pixels tall, so the padding here
            // exists to give the hover a usable target.
            className="group/seg relative flex-1 cursor-default py-1"
          >
            <div
              className={cn(
                "h-1.5 rounded-sm transition-colors",
                timegoal.is_achieved ? "bg-green-400" : "bg-white/15",
              )}
            />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-0.5 flex -translate-x-1/2 flex-col items-center gap-0.5 whitespace-nowrap rounded-md border border-border bg-surface-1 px-2 py-1 opacity-0 transition-opacity duration-200 group-hover/seg:opacity-100">
              <span
                className={cn(
                  "text-[10px] leading-none",
                  timegoal.is_achieved ? "text-green-300" : "text-muted-foreground",
                )}
              >
                {timegoal.name}
              </span>
              <span className="text-[10px] leading-none tabular-nums text-muted-foreground">
                {millisecondsToTimeString(timegoal.time)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
