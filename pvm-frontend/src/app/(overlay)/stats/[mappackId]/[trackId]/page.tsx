"use client";

import { mappackService } from "@/services/mappack.service";
import { Mappack, PlayerLeaderboardEntry } from "@/types/mappack.types";
import React, { useEffect, useState } from "react";
import { getPlayerRank } from "@/utils/mappack.utils";

interface StatsPageProps{
  params: Promise<{ mappackId: string; trackId: string }>;
  searchParams: Promise<{ playerId?: string}>; 
}

export default function StatsPage({
  params,
  searchParams,
} : StatsPageProps) {
const { mappackId, trackId} = React.use(params);
  const {playerId: playerIdParam} = React.use(searchParams);
  const playerId = playerIdParam ? String(playerIdParam) : ""
  const [leaderboard, setLeaderboard] = useState<PlayerLeaderboardEntry | null>(null);
  const [mappack, setMappack] = useState<Mappack | null>(null);


  const playerRank = getPlayerRank(leaderboard?.entry.total_points ?? 0, mappack?.mappackRanks ?? []) 

  const load = async () => {
    try {
      const data = await mappackService.getPlayerLeaderboardEntry(
        mappackId,
        playerId,
      );
      setLeaderboard(data);

      const mappackData = await mappackService.getMappack(
        mappackId
      )
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

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "transparent",
        }}>
      <div className="font-ruigslay"
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
        <span>
        <p className="font-casko">
          {leaderboard?.entry.total_points.toLocaleString()}PTS
          RANK #{leaderboard?.rank}
        </p>
        </span>
        <p style={
          {
            color : playerRank?.color,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.15,
            textTransform: "uppercase"
          }
        }>
          {playerRank?.name}
        </p>
        </div>
    </div>

  )


} 