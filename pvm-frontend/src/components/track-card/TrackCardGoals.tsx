import { millisecondsToTimeString } from "@/utils/time.utils";
import { EnrichedTimeGoal } from "@/utils/player.utils";
import { cn } from "@/lib/utils";

interface TrackCardGoalsProps {
  timeGoals: EnrichedTimeGoal[];
  /**
   * Renders the goals as a fixed-height segmented bar rather than one chip per
   * goal. Chips wrap, so on a card that shows its details permanently a mappack
   * with several goals would grow the footer until it covered the whole card.
   */
  compact?: boolean;
}

const TOOLTIP =
  "pointer-events-none absolute bottom-full left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface-1 px-2 py-1 opacity-0 transition-opacity duration-200";

export function TrackCardGoals({ timeGoals, compact = false }: TrackCardGoalsProps) {
  if (timeGoals.length === 0) {
    return (
      <p className="py-1 text-center text-[10px] tabular-nums text-faint">
        No time goals
      </p>
    );
  }

  const achievedCount = timeGoals.filter((tg) => tg.is_achieved).length;

  const summary = (
    <div className="flex items-center justify-between">
      <span className="text-[10px] tracking-wider uppercase text-muted-foreground">
        Timegoals {achievedCount}/{timeGoals.length}
      </span>
      {!compact && (
        <div className="ml-2 h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-green-400 transition-all duration-500"
            style={{ width: `${(achievedCount / timeGoals.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );

  if (compact) {
    return (
      <div className="flex flex-col gap-1 pb-1.5">
        {summary}
        {/* One segment per goal, so the height never changes with goal count. */}
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
              <div className={cn(TOOLTIP, "mb-0.5 flex flex-col items-center gap-0.5 group-hover/seg:opacity-100")}>
                <span
                  className={cn(
                    "text-[10px] leading-none uppercase",
                    timegoal.is_achieved ? "text-green-300" : "text-muted-foreground",
                  )}
                >
                  {timegoal.name}
                </span>
                <span className="text-[10px] tabular-nums leading-none text-muted-foreground">
                  {millisecondsToTimeString(timegoal.time)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {summary}

      <div className="flex flex-wrap gap-0.5">
        {timeGoals.map((timegoal) => (
          <div
            key={timegoal.time_goal_id}
            className={cn(
              "group/goal relative mb-1 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase transition-all duration-200",
              timegoal.is_achieved
                ? "border-green-400/50 bg-green-500/30 text-green-300"
                : "border-white/10 bg-white/5 text-muted-foreground",
            )}
          >
            {timegoal.name}
            <div className={cn(TOOLTIP, "mb-1 flex flex-col items-center gap-0.5 normal-case group-hover/goal:opacity-100")}>
              <span className="tabular-nums text-foreground">
                {millisecondsToTimeString(timegoal.time)}
              </span>
              <span className="text-[9px] tabular-nums text-muted-foreground">
                ×{timegoal.multiplier.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
