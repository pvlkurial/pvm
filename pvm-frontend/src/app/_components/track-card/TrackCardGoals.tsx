"use client";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

interface TooltipState {
  x: number;
  y: number;
  goal: EnrichedTimeGoal;
}

function Tooltip({ x, y, goal }: TooltipState) {
  return createPortal(
    <div
      className="fixed z-[9999] px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg
                 text-[10px] whitespace-nowrap pointer-events-none shadow-xl opacity-95 transition-all duration-200 ease-in-out"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -100%) translateY(-6px)",
      }}
    >
      <div className="flex flex-col items-center gap-0">
        <span className="text-white/80 font-medium">{goal.name}</span>
        <span className="font-mono text-white/50">
          {millisecondsToTimeString(goal.time)}
        </span>
        <span className="text-white/30 text-[9px]">
          ×{goal.multiplier.toFixed(1)}
        </span>
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-700" />
    </div>,
    document.body,
  );
}

export function TrackCardGoals({
  enrichedTimeGoals,
  achievedCount,
  totalCount,
}: TrackCardGoalsProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [truncate, setTruncate] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const rowHeight = 20;
    const maxRows = window.innerWidth >= 1024 ? 3 : 2;
    setTruncate(el.scrollHeight > rowHeight * maxRows + 4);
  }, [enrichedTimeGoals]);

  if (enrichedTimeGoals.length === 0) {
    return (
      <p className="text-white/30 text-[10px] text-center py-1">
        No time goals
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
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

      <div ref={wrapperRef} className="flex gap-0.5 flex-wrap">
        {enrichedTimeGoals.map((timegoal) => {
          const isAchieved = timegoal.is_achieved || false;
          const label = truncate ? timegoal.name.slice(0, 3) : timegoal.name;
          return (
            <div
              key={timegoal.time_goal_id}
              onMouseEnter={(e) => {
                const rect = (
                  e.currentTarget as HTMLElement
                ).getBoundingClientRect();
                setTooltip({
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                  goal: timegoal,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              className={`
                relative flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium
                transition-all duration-200 cursor-pointer
                ${
                  isAchieved
                    ? "bg-green-500/30 text-green-300 border border-green-400/50"
                    : "bg-white/5 text-white/50 border border-white/10"
                }
              `}
            >
              <span className="uppercase tracking-wide">{label}</span>
              {isAchieved ? (
                <span className="text-green-400 text-[8px]">✓</span>
              ) : (
                <span className="text-white/20 text-[8px]">○</span>
              )}
            </div>
          );
        })}
      </div>

      {tooltip && <Tooltip {...tooltip} />}
    </div>
  );
}
