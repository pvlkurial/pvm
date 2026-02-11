// components/track-detail/TimeGoalCard.tsx
import { FaClock, FaCheck } from "react-icons/fa";
import { millisecondsToTimeString, calculateTimeDelta } from "@/utils/time.utils";

interface TimeGoalCardProps {
  name: string;
  time: number;
  personalBest?: number;
}

export function TimeGoalCard({ name, time, personalBest }: TimeGoalCardProps) {
  const hasPB = personalBest !== undefined && personalBest > 0;
  const delta = hasPB ? calculateTimeDelta(personalBest, time) : null;

  return (
    <div
      className={`
        relative rounded-lg p-3 border transition-all duration-200
        ${delta?.isAchieved
          ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/15'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105'
        }
      `}
    >
      {/* Achievement Badge */}
      {delta?.isAchieved && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <FaCheck className="w-2.5 h-2.5 text-white" />
        </div>
      )}

      {/* Goal Name & Time on same line */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs uppercase tracking-wider text-white/60 font-semibold truncate">
          {name}
        </span>
        <FaClock className="w-2.5 h-2.5 text-white/30 flex-shrink-0" />
      </div>

      {/* Goal Time */}
      <div className="text-base font-bold font-mono text-white mb-2">
        {millisecondsToTimeString(time)}
      </div>

      {/* Delta Display - Compact */}
      {delta ? (
        <div className="text-xs font-mono font-bold">
          <span
            className={delta.isAchieved ? 'text-blue-400' : 'text-red-400'}
          >
            {delta.formatted}
          </span>
        </div>
      ) : (
        <div className="text-xs text-white/20">
          Not played
        </div>
      )}
    </div>
  );
}