"use client";

import React, { useEffect, useState } from "react";
import { Track } from "@/types/mappack.types";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { FormattedText } from "@/utils/textConverter";
import { trackService } from "@/services/track.service";

interface OverlayPageProps {
  params: Promise<{ mappackId: string; trackId: string }>;
  searchParams: Promise<{ playerId?: string, goalIndex?: string }>;
}

export default function OverlayPage({
  params,
  searchParams,
}: OverlayPageProps) {
  const { mappackId, trackId} = React.use(params);
  const {playerId: playerIdParam, goalIndex: goalIndexParam } = React.use(searchParams);
  const goalIndex = goalIndexParam ? Number(goalIndexParam) : 0;
  const playerId = playerIdParam ? String(playerIdParam) : ""

  const [track, setTrack] = useState<Track | null>(null);

  const load = async () => {
    try {
      const data = await trackService.getTrackDetails(
        mappackId,
        trackId,
        playerId,
      );
      setTrack(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [mappackId, trackId, playerId]);

  if (!track) return null;

  const goal = track.timegoals?.[goalIndex] ?? track.timegoals?.[0];
  const isAchieved =
    track.personalBest != null &&
    goal != null &&
    track.personalBest <= goal.time;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=DM+Sans:wght@700;800&display=swap"
      />

      {/* Outer wrapper — transparent, fits content */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "transparent",
        }}
      >
        {/* Thumbnail — square */}
        <div
          style={{
            width: 110,
            height: 110,
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
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* Text panel — shorter than thumbnail, tucks behind it */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "10px 28px 10px 22px",
            background: "rgba(15, 15, 18, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "0 10px 10px 0",
            marginLeft: -10,
            position: "relative",
            zIndex: 1,
            gap: 2,
            minWidth: 300,
          }}
        >
          {/* Author */}
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              display: "inline-block",
              transform: "scaleX(1.08)",
              transformOrigin: "left",
              whiteSpace: "nowrap",
            }}
          >
            {track.authorName || track.author}
          </span>

          {/* Track name */}
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 17,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.15,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 300,
              display: "inline-block",
              transform: "scaleX(1.08)",
              transformOrigin: "left",
            }}
          >
            <FormattedText text={track.name} />
          </div>

          {goal && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: isAchieved
                    ? "rgb(134, 239, 172)"
                    : "rgba(255,255,255,0.50)",
                  background: isAchieved
                    ? "rgba(34, 197, 94, 0.3)"
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isAchieved ? "rgba(74, 222, 128, 0.5)" : "rgba(255,255,255,0.10)"}`,
                  borderRadius: 4,
                  padding: "2px 6px",
                  whiteSpace: "nowrap",
                }}
              >
                {goal.name}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  fontVariantNumeric: "tabular-nums",
                  fontStyle: "normal",
                  color: isAchieved
                    ? "rgb(134, 239, 172)"
                    : "rgba(255,255,255,0.85)",
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                }}
              >
                {millisecondsToTimeString(goal.time)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
