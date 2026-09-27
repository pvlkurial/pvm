"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  /** Fill colour. Mappack accent colours go here, never into text. */
  color?: string;
  className?: string;
}

/** A thin animated bar; callers put any label or count next to it. */
export function ProgressBar({
  current,
  total,
  color = "var(--pack-neutral)",
  className,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      className={cn("h-1.5 overflow-hidden rounded-full bg-surface-3", className)}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
      />
    </div>
  );
}
