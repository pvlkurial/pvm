// TimeGoalCard.tsx
import { millisecondsToTimeString, calculateTimeDelta } from "@/utils/time.utils";

interface TimeGoalCardProps {
  name: string;
  time: number;
  personalBest?: number;
  multiplier?: number;
}

export function TimeGoalCard({ name, time, personalBest, multiplier }: TimeGoalCardProps) {
  const hasPB = personalBest !== undefined && personalBest > 0;
  const delta = hasPB ? calculateTimeDelta(personalBest, time) : null;

  return (
    <div
      className="relative rounded-xl p-3 transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: delta?.isAchieved
          ? "linear-gradient(135deg, rgba(74,222,128,0.08) 0%, rgba(255,255,255,0.03) 60%)"
          : "rgba(255,255,255,0.03)",
        boxShadow: delta?.isAchieved
          ? "0 0 0 1px rgba(74,222,128,0.2)"
          : "0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Achieved dot */}
      {delta?.isAchieved && (
        <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-green-400/70" />
      )}

      {/* Name */}
      <p className={`text-[10px] tracking-widest uppercase mb-2 pr-4 leading-tight text-label ${
        delta?.isAchieved ? "text-neutral-400" : "text-neutral-600"
      }`}>
        {name}
      </p>

      {/* Time */}
      <p className={`text-xl leading-none mb-2 text-label ${
        delta?.isAchieved ? "text-white" : "text-neutral-500"
      }`}>
        {millisecondsToTimeString(time)}
      </p>

      {/* Delta */}
      {hasPB && delta ? (
        <p className={`font-mono text-xs font-bold text.label ${
          delta.isAchieved ? "text-blue-400" : "text-red-400"
        }`}>
          {delta.formatted}
        </p>
      ) : (
        <p className="text-neutral-700 text-xs">—</p>
      )}
    </div>
  );
}