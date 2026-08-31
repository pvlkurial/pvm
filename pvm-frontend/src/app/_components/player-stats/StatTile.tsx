import React from "react";

interface StatTileProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A labelled figure, shared by the mappack sidebar and the player detail modal.
 * Deliberately unboxed — spacing separates the stats, not borders.
 */
export function StatTile({ label, children, className = "" }: StatTileProps) {
  return (
    <div className={className}>
      <p className="text-[10px] tracking-widest uppercase text-white/35 mb-1.5 text-label">
        {label}
      </p>
      {children}
    </div>
  );
}
