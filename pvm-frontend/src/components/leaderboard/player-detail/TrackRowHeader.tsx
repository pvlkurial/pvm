import { trackRowColumns } from "./trackRowLayout";

/** Column labels shown once per tier, so rows themselves stay label-free. */
export function TrackRowHeader({ withComparison }: { withComparison: boolean }) {
  return (
    <div
      className="hidden items-center gap-4 px-3 pb-1 font-mono text-mono-s uppercase text-faint md:grid"
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
