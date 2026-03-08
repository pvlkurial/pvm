import { FaTrophy } from "react-icons/fa6";

interface TrackCardRankProps {
  position: number;
}

const TROPHY_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

export function TrackCardRank({ position }: TrackCardRankProps) {
  const isTop3 = position <= 3;
  const trophyColor = TROPHY_COLORS[position];

  if (position > 10) return null;
  return (
    <div
      className="absolute top-0 right-0 z-20 flex items-center gap-1 px-3 py-1.5 rounded-bl-xl"
      style={{
        background: isTop3
          ? `linear-gradient(135deg, ${trophyColor}22 0%, rgba(0,0,0,0.6) 100%)`
          : "rgba(0,0,0,0.5)",
        boxShadow: isTop3
          ? `inset 0 0 0 1px ${trophyColor}30`
          : "inset 0 0 0 1px rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      {isTop3 && (
        <FaTrophy
          className="w-3 h-3 shrink-0"
          style={{
            color: trophyColor,
            filter: `drop-shadow(0 0 4px ${trophyColor}80)`,
          }}
        />
      )}
      <span
        className="font-ruigslay leading-none"
        style={{
          fontSize: 13,
          color: isTop3 ? trophyColor : "rgba(255,255,255,0.4)",
          textShadow: isTop3 ? `0 0 12px ${trophyColor}60` : "none",
        }}
      >
        {position === 1 ? "WR" : `#${position}`}
      </span>
    </div>
  );
}
