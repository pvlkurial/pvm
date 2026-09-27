import { MappackRank } from "@/types/mappack.types";
import { ProgressBar } from "@/components/common/ProgressBar";

interface RankDisplayProps {
  rank: MappackRank;
  nextRank?: MappackRank;
  currentPoints: number;
}

/** Shrinks long rank names so they still fit a narrow column. */
function rankNameFontSize(name: string): string {
  const min = Math.max(13, 40 - name.length * 3);
  const preferred = Math.max(1.4, 4 - name.length * 0.25);
  const max = Math.max(18, 56 - name.length * 4);
  return `clamp(${min}px, ${preferred}vw, ${max}px)`;
}

export function RankDisplay({ rank, nextRank, currentPoints }: RankDisplayProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="eyebrow mb-2">Current rank</p>
        <p
          className="font-display leading-none"
          style={{ fontSize: rankNameFontSize(rank.name), color: rank.color }}
        >
          {rank.name}
        </p>
      </div>

      {nextRank && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 font-mono text-mono-s text-faint">
            <span className="uppercase">Next: {nextRank.name}</span>
            <span>
              {(nextRank.pointsNeeded - currentPoints).toLocaleString()} pts to go
            </span>
          </div>
          <ProgressBar
            current={currentPoints - rank.pointsNeeded}
            total={nextRank.pointsNeeded - rank.pointsNeeded}
            color={nextRank.color}
          />
        </div>
      )}
    </div>
  );
}
