import { Chip } from "@heroui/react";
import { TimeGoal } from "@/types/mappack.types";

interface TimeGoalOptionProps {
  timeGoal: TimeGoal;
  notAchievedCount: number;
  isSelected: boolean;
  onClick: () => void;
}

export function TimeGoalOption({
  timeGoal,
  notAchievedCount,
  isSelected,
  onClick,
}: TimeGoalOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-3 rounded-lg border transition-all text-left
        ${
          isSelected
            ? "bg-orange-500/20 border-orange-500 text-white"
            : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/70"
        }
      `}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left side - Name and badges */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span className="text-sm font-semibold truncate">{timeGoal.name}</span>
          <div className="flex items-center gap-1.5">
            <Chip size="sm" className="bg-zinc-700 text-zinc-400 text-xs">
              ×{timeGoal.multiplier}
            </Chip>
            <Chip
              size="sm"
              className={`text-xs ${
                notAchievedCount === 0
                  ? "bg-green-500/20 text-green-400"
                  : "bg-orange-500/20 text-orange-400"
              }`}
            >
              {notAchievedCount} left
            </Chip>
          </div>
        </div>

        {/* Right side - Check icon */}
        {isSelected && (
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-orange-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}