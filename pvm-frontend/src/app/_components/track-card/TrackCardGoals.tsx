import { millisecondsToTimeString } from "@/utils/time.utils";

interface EnrichedTimeGoal {
  time_goal_id: number;
  time: number;
  is_achieved?: boolean;
  player_time?: number;
  name: string;
  multiplier: number;
}

interface TrackCardGoalsProps {
  enrichedTimeGoals: EnrichedTimeGoal[];
  achievedCount: number;
  totalCount: number;
}

export function TrackCardGoals({ 
  enrichedTimeGoals, 
  achievedCount, 
  totalCount 
}: TrackCardGoalsProps) {
  if (enrichedTimeGoals.length === 0) {
    return (
      <p className="text-white/30 text-[10px] text-center py-1">
        No time goals
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/40 uppercase tracking-wider">
          Timegoals {achievedCount}/{totalCount}
        </span>
        <div className="flex-1 h-1 mx-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 transition-all duration-500"
            style={{ width: `${(achievedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {enrichedTimeGoals.map((timegoal) => {
          const isAchieved = timegoal.is_achieved || false;
          
          return (
            <div
              key={timegoal.time_goal_id}
              className={`
                group/goal relative flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium
                transition-all duration-200
                ${isAchieved 
                  ? 'bg-green-500/30 text-green-300 border border-green-400/50' 
                  : 'bg-white/5 text-white/50 border border-white/10'
                }
              `}
            >
              <span className="uppercase tracking-wide">
                {timegoal.name}
              </span>
              
              {isAchieved ? (
                <span className="text-green-400">✓</span>
              ) : (
                <span className="text-white/20">○</span>
              )}

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 
                            bg-black/80 text-white text-[10px] rounded whitespace-nowrap
                            opacity-0 group-hover/goal:opacity-100 pointer-events-none
                            transition-opacity duration-200">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-mono text-white/70">
                    {millisecondsToTimeString(timegoal.time)}
                  </span>
                  <span className="text-white/50 text-[9px]">
                    ×{timegoal.multiplier.toFixed(1)}
                  </span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 
                              border-4 border-transparent border-t-black/90" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}