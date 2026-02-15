import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";
import { FaCheckCircle } from "react-icons/fa";

interface MappackProgressBarProps {
  completionCurrent: number;
  completionTotal: number;
}

export function MappackProgressBar({
  completionCurrent,
  completionTotal,
}: MappackProgressBarProps) {
  const completionPercentage = completionTotal > 0 
    ? Math.min((completionCurrent / completionTotal) * 100, 100) 
    : 0;

return (
  <div className="mb-4">
    {/* Progress Bar with text inside */}
    <div className="relative h-8 rounded-full bg-neutral-700/50 overflow-hidden">
      {/* Filled portion */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-900 via-green-500 to-emerald-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${completionPercentage}%` }}
        transition={{ 
          duration: 1.2, 
          ease: [0.4, 0, 0.2, 1],
          delay: 0.2 
        }}
      />
      
      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white/30 drop-shadow-lg">
          COMPLETED {completionCurrent}/{completionTotal}
        </span>
      </div>
    </div>
  </div>
);
}