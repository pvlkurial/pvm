import React from "react";

interface StatTileProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Labelled stat panel shared by the mappack sidebar and the player detail
 * modal, so the same figures read the same way in both places.
 */
export function StatTile({ label, children, className = "" }: StatTileProps) {
  return (
    <div
      className={`rounded-lg bg-white/[0.04] border border-white/[0.06] px-4 py-3 ${className}`}
    >
      <p className="text-[10px] tracking-widest uppercase text-white/35 mb-1 text-label">
        {label}
      </p>
      {children}
    </div>
  );
}
