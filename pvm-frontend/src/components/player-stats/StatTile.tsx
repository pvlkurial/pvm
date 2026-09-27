interface StatTileProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** A labelled figure. Deliberately unboxed: spacing separates the stats, not borders. */
export function StatTile({ label, children, className }: StatTileProps) {
  return (
    <div className={className}>
      <p className="eyebrow mb-2">{label}</p>
      {children}
    </div>
  );
}
