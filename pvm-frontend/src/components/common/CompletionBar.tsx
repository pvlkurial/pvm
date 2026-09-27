"use client";
import { motion } from "framer-motion";

interface CompletionBarProps {
  current: number;
  total: number;
}

/** Achieved time goals out of all of them, with the count written inside the bar. */
export function CompletionBar({ current, total }: CompletionBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      className="relative h-8 overflow-hidden rounded-full bg-surface-3"
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-900 via-green-500 to-emerald-500"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-small font-medium text-foreground/85">
        Completed {current}/{total}
      </span>
    </div>
  );
}
