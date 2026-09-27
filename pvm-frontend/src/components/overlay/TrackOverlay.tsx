import { Track } from "@/types/mappack.types";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { FormattedText } from "@/components/common/FormattedText";
import { OverlayStyle } from "./overlayStyle";

interface TrackOverlayProps {
  track: Track;
  goal?: { name: string; time: number };
  style: OverlayStyle;
}

/** The OBS overlay for one track: thumbnail plus author, name and a time goal. */
export function TrackOverlay({ track, goal, style }: TrackOverlayProps) {
  const { side, bgOpacity, accentColor, scale } = style;
  const isAchieved = track.personalBest != null && goal != null && track.personalBest <= goal.time;

  const accentBg = `${accentColor}4d`;
  const accentBorder = `${accentColor}80`;

  const thumbnail = (
    <div
      style={{
        width: 110 * scale,
        height: 110 * scale,
        flexShrink: 0,
        borderRadius: 10,
        overflow: "hidden",
        position: "relative",
        zIndex: 2,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <img
        src={track.thumbnailUrl}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );

  const textPanel = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: `${10 * scale}px ${side === "left" ? 28 * scale : 22 * scale}px ${10 * scale}px ${side === "left" ? 28 * scale : 22 * scale}px`,
        background: `rgba(15, 15, 18, ${bgOpacity})`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: side === "right" ? "0 10px 10px 0" : "10px 0 0 10px",
        marginLeft: side === "right" ? -10 : 0,
        marginRight: side === "left" ? -10 : 0,
        position: "relative",
        zIndex: 1,
        gap: 2 * scale,
        minWidth: 300 * scale,
      }}
    >
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 10 * scale,
          fontWeight: 400,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          display: "inline-block",
          transform: "scaleX(1.08)",
          transformOrigin: side === "right" ? "left" : "right",
          whiteSpace: "nowrap",
        }}
      >
        {track.authorName || track.author}
      </span>

      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 17 * scale,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.15,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 300 * scale,
          display: "inline-block",
          transform: "scaleX(1.08)",
          transformOrigin: side === "right" ? "left" : "right",
        }}
      >
        <FormattedText text={track.name} />
      </div>

      {goal && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 * scale, marginTop: 4 * scale }}>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 10 * scale,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: isAchieved ? accentColor : "rgba(255,255,255,0.50)",
              background: isAchieved ? accentBg : "rgba(255,255,255,0.05)",
              border: `1px solid ${isAchieved ? accentBorder : "rgba(255,255,255,0.10)"}`,
              borderRadius: 4,
              padding: `2px ${6 * scale}px`,
              whiteSpace: "nowrap",
            }}
          >
            {goal.name}
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16 * scale,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              fontStyle: "normal",
              color: isAchieved ? accentColor : "rgba(255,255,255,0.85)",
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
            }}
          >
            {millisecondsToTimeString(goal.time)}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=DM+Sans:wght@700;800&display=swap"
      />
      <div style={{ display: "inline-flex", alignItems: "center", background: "transparent" }}>
        {side === "left" ? <>{textPanel}{thumbnail}</> : <>{thumbnail}{textPanel}</>}
      </div>
    </>
  );
}
