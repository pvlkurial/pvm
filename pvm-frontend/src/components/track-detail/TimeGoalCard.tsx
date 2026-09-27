import { millisecondsToTimeString, calculateTimeDelta } from "@/utils/time.utils";
import { cn } from "@/lib/utils";

interface TimeGoalCardProps {
  name: string;
  time: number;
  personalBest?: number;
  multiplier?: number;
}

export function TimeGoalCard({ name, time, personalBest, multiplier }: TimeGoalCardProps) {
  const delta = personalBest ? calculateTimeDelta(personalBest, time) : null;
  const isAchieved = delta?.isAchieved ?? false;

  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-transform duration-200 hover:scale-[1.02]",
        isAchieved
          ? "border-green-400/40 bg-green-400/[0.06]"
          : "border-border-subtle bg-surface-2",
      )}
    >
      <p className="mb-2 text-caption text-muted-foreground">
        {name} | {multiplier}x
      </p>
      <p
        className={cn(
          "mb-2 tabular-nums text-xl leading-none",
          isAchieved ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {millisecondsToTimeString(time)}
      </p>
      {delta ? (
        <p
          className={cn(
            "tabular-nums text-xs font-semibold",
            delta.isAchieved ? "text-blue-400" : "text-red-400",
          )}
        >
          {delta.formatted}
        </p>
      ) : (
        <p className="text-xs text-faint">—</p>
      )}
    </div>
  );
}
