import { trackRowColumns } from "./trackRowLayout";

interface TrackRowHeaderProps {
  withComparison: boolean;
}

/** Column labels shown once per tier, so rows themselves stay label-free. */
export function TrackRowHeader({ withComparison }: TrackRowHeaderProps) {
  return (
    <div
      className="hidden md:grid items-center gap-4 px-3 pb-1 text-xs text-white/40"
      style={{ gridTemplateColumns: trackRowColumns(withComparison) }}
    >
      <span />
      <span>Track</span>
      <span className="text-center">Goal</span>
      <span className="text-center">Time</span>
      {withComparison && <span className="text-center">Δ Time</span>}
      <span className="text-center">Pts</span>
      {withComparison && <span className="text-center">Δ Pts</span>}
    </div>
  );
}
