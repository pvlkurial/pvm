import React from "react";

interface SectionHeadingProps {
  children: React.ReactNode;
  /** Extra classes for the wrapper, e.g. top spacing between sections. */
  className?: string;
}

/**
 * The label-plus-rule heading used throughout the admin modals and panels.
 * Matches the Basic Info tab of the edit mappack modal.
 */
export function SectionHeading({
  children,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`grid grid-cols-[auto_1fr] items-center gap-2 ${className}`}
    >
      <p className="text-xl font-ruigslay text-white">{children}</p>
      <div className="flex-1 h-[5px] bg-neutral-300" />
    </div>
  );
}
