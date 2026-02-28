import { TimeGoal } from "@/types/mappack.types";

interface TimeGoalOptionProps {
  timeGoal: TimeGoal;
  notAchievedCount: number;
  isSelected: boolean;
  onClick: () => void;
}

// Give each multiplier tier a distinctive color
const getMultiplierColor = (multiplier: number): string => {
  if (multiplier >= 3) return "text-red-400";
  if (multiplier >= 2) return "text-orange-400";
  if (multiplier >= 1.5) return "text-yellow-400";
  return "text-sky-400";
};

export function TimeGoalOption({
  timeGoal,
  notAchievedCount,
  isSelected,
  onClick,
}: TimeGoalOptionProps) {
  const multiplierColor = getMultiplierColor(timeGoal.multiplier);

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer ${
        isSelected
          ? "bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
          : "bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:bg-white/[0.06] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <p className={`font-ruigslay text-lg leading-none mb-2 truncate ${isSelected ? "text-white" : "text-white/70"}`}>
            {timeGoal.name}
          </p>
          <div className="flex items-center gap-2.5">
            <span className={`text-sm font-semibold ${multiplierColor}`}>
              ×{timeGoal.multiplier}
            </span>
            <span className="text-neutral-700 text-xs">·</span>
            <span className={`text-xs tracking-wide ${
              notAchievedCount === 0 ? "text-green-400" : "text-neutral-400"
            }`}>
              {notAchievedCount === 0 ? "all done" : `${notAchievedCount} left`}
            </span>
          </div>
        </div>

        {/* Check */}
        {isSelected && (
          <svg className="w-4 h-4 text-white/60 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
}