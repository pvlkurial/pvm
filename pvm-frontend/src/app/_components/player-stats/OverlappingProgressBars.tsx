// components/player-stats/OverlappingProgressBars.tsx
import { motion } from "framer-motion";

interface OverlappingProgressBarsProps {
  completionCurrent: number;
  completionTotal: number;
  achievementsCurrent: number;
  achievementsTotal: number;
}

export function OverlappingProgressBars({
  completionCurrent,
  completionTotal,
}: OverlappingProgressBarsProps) {
  const completionPercentage = completionTotal > 0 
    ? Math.min((completionCurrent / completionTotal) * 100, 100) 
    : 0;

  return (
    <div className="space-y-3">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/40">Maps played</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/50">
            {completionCurrent}/{completionTotal}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 rounded-full bg-neutral-700/50 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-900 to-yellow-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ 
            duration: 1.2, 
            ease: [0.4, 0, 0.2, 1],
            delay: 0.3 
          }}
        />
      </div>
    </div>
  );
}