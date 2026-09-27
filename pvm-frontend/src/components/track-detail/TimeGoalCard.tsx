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
        "rounded-xl border p-4",
        isAchieved ? "border-green-400/40 bg-green-400/[0.06]" : "border-border-subtle bg-surface-2",
      )}
    >
      <div className="flex items-baseline justify-between gap-2 text-small">
        <span className="truncate text-muted-foreground">{name}</span>
        {multiplier !== undefined && <span className="text-faint">{multiplier}x</span>}
      </div>
      <p
        className={cn(
          "mt-2 text-xl leading-none tabular-nums",
          isAchieved ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {millisecondsToTimeString(time)}
      </p>
      <p
        className={cn(
          "mt-2 text-small tabular-nums",
          !delta ? "text-faint" : delta.isAchieved ? "text-green-400" : "text-red-400",
        )}
      >
        {delta ? delta.formatted : "—"}
      </p>
    </div>
  );
}
