"use client";

import { mappackService } from "@/services/mappack.service";
import { Mappack, PlayerLeaderboardEntry } from "@/types/mappack.types";
import React, { useEffect, useState } from "react";
import { getPlayerRank } from "@/utils/mappack.utils";

interface StatsPageProps {
  params: Promise<{ mappackId: string }>;
  searchParams: Promise<{ playerId?: string; opacity?: string; accent?: string }>;
}

export default function StatsPage({ params, searchParams }: StatsPageProps) {
  const { mappackId } = React.use(params);
  const { playerId: playerIdParam, opacity: opacityParam, accent: accentParam } = React.use(searchParams);
  const playerId = playerIdParam ?? "";
  const bgOpacity = opacityParam ? Math.min(100, Math.max(0, Number(opacityParam))) / 100 : 0.75;
  const accentColor = (accentParam && accentParam !== "base") ? `#${accentParam}` : null;

  const [leaderboard, setLeaderboard] = useState<PlayerLeaderboardEntry | null>(null);
  const [mappack, setMappack] = useState<Mappack | null>(null);

  const load = async () => {
    try {
      const [data, mappackData] = await Promise.all([
        mappackService.getPlayerLeaderboardEntry(mappackId, playerId),
        mappackService.getMappack(mappackId),
      ]);
      setLeaderboard(data);
      setMappack(mappackData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 300_000);
    return () => clearInterval(interval);
  }, [mappackId, playerId]);

  if (!leaderboard || !mappack) return null;

  const { entry, rank } = leaderboard;
  const sortedRanks = [...(mappack.mappackRanks ?? [])].sort(
    (a, b) => a.pointsNeeded - b.pointsNeeded,
  );
  const playerRank = getPlayerRank(entry.total_points, sortedRanks);
  const nextRank = sortedRanks.find((r) => r.pointsNeeded > entry.total_points);
  const progress = playerRank && nextRank
    ? Math.min(
        ((entry.total_points - playerRank.pointsNeeded) /
          (nextRank.pointsNeeded - playerRank.pointsNeeded)) * 100,
        100,
      )
    : 100;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=DM+Sans:wght@700;800&display=swap"
      />

      <div style={{ display: "inline-flex", alignItems: "center", background: "transparent" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "10px 20px 10px 22px",
            background: `rgba(15, 15, 18, ${bgOpacity})`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 10,
            gap: 2,
            minWidth: 0,
          }}
        >
          {/* Player name — like author */}
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
            {entry.player.name}
          </span>

          {/* Points + rank name + rank pill all in one row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2, overflow: "hidden" }}>
            {/* Points */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <span
                style={{
                  fontFamily: "var(--font-my-custom), sans-serif",
                  fontSize: 36,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {entry.total_points.toLocaleString()}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-my-custom), sans-serif",
                  fontSize: 14,
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.35)",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                PTS
              </span>
            </div>

            {/* Rank name */}
            <div
              style={{
                fontFamily: "var(--font-my-custom), sans-serif",
                fontWeight: 900,
                lineHeight: 1.15,
                textTransform: "uppercase",
                color: accentColor ?? playerRank?.color ?? "#ffffff",
                textShadow: (accentColor ?? playerRank?.color) ? `0 0 20px ${accentColor ?? playerRank?.color}50` : undefined,
                whiteSpace: "normal",
                wordBreak: "keep-all",
                overflowWrap: "normal",
                overflow: "hidden",
                width: "auto",
                maxWidth: 280,
                flexShrink: 0,
                maxHeight: "2.4em",
                fontSize: 24,
              }}
            >
              {playerRank?.name ?? "—"}
            </div>

            {/* Rank pill — centered to rank name */}
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: accentColor ?? playerRank?.color ?? "rgba(255,255,255,0.50)",
                background: (accentColor ?? playerRank?.color) ? `${accentColor ?? playerRank?.color}30` : "rgba(255,255,255,0.05)",
                border: `1px solid ${(accentColor ?? playerRank?.color) ? `${accentColor ?? playerRank?.color}60` : "rgba(255,255,255,0.10)"}`,
                borderRadius: 4,
                padding: "2px 6px",
                whiteSpace: "nowrap",
                flexShrink: 0,
                alignSelf: "center",
              }}
            >
              #{rank}
            </span>
          </div>

          {/* Progress bar to next rank — full width, thin */}
          {nextRank && (
            <div
              style={{
                height: 3,
                borderRadius: 99,
                background: "rgba(255,255,255,0.06)",
                overflow: "hidden",
                marginTop: 6,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  borderRadius: 99,
                  background: (accentColor ?? nextRank.color)
                    ? `linear-gradient(to right, ${accentColor ?? nextRank.color}50, ${accentColor ?? nextRank.color})`
                    : "rgba(255,255,255,0.4)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}