"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Spinner, Button } from "@heroui/react";
import { Casko } from "@/fonts";
import { MappackRank, Mappack } from "@/types/mappack.types";
import PlayerDetailModal from "./player-detail/PlayerDetailModal";
import PlayerSearch from "./PlayerSearch";

interface LeaderboardEntry {
  player_id: string;
  mappack_id: string;
  total_points: number;
  achievements_count: number;
  best_achievements_count: number;
  last_updated: string;
  player: {
    ID: string;
    name: string;
    Records: null;
  };
}

interface LeaderboardTabProps {
  mappackId: string;
  mappackRanks: MappackRank[];
  loggedInMappack?: Mappack;
}

const ITEMS_PER_PAGE = 100;

const getPlayerRank = (points: number, ranks: MappackRank[]): MappackRank | null => {
  const sortedRanks = [...ranks].sort((a, b) => b.pointsNeeded - a.pointsNeeded);
  for (const rank of sortedRanks) {
    if (points >= rank.pointsNeeded) return rank;
  }
  return sortedRanks[sortedRanks.length - 1] || null;
};

const getAnimationClass = (animationType: string): string => {
  switch (animationType) {
    case "shine": return "animate-shine";
    case "pulse": return "animate-pulse";
    case "shimmer": return "animate-shimmer";
    default: return "";
  }
};

const getBackgroundPattern = (pattern: string, color: string): string => {
  switch (pattern) {
    case "dots":
      return `radial-gradient(circle, ${color}30 1px, transparent 1px)`;
    case "grid":
      return `linear-gradient(${color}20 1px, transparent 1px), linear-gradient(90deg, ${color}20 1px, transparent 1px)`;
    case "diagonal":
      return `repeating-linear-gradient(45deg, transparent, transparent 10px, ${color}15 10px, ${color}15 20px)`;
    default:
      return "none";
  }
};

const getCardStyleEffects = (cardStyle: string, color: string) => {
  switch (cardStyle) {
    case "metallic":
      return {
        background: `linear-gradient(135deg, ${color}dd 0%, ${color}aa 50%, ${color}dd 100%)`,
        filter: "brightness(1.1) contrast(1.1)",
      };
    case "holographic":
      return {
        background: `linear-gradient(135deg, ${color}dd, ${color}88, ${color}dd)`,
        backgroundSize: "200% 200%",
        animation: "holographic 3s ease infinite",
      };
    case "neon":
      return {
        background: `${color}20`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}40`,
      };
    default:
      return {};
  }
};

const getFontSizeClass = (fontSize: string): string => {
  switch (fontSize) {
    case "large": return "text-xl";
    case "xl": return "text-2xl";
    default: return "text-lg";
  }
};

const getFontWeightClass = (fontWeight: string): string => {
  switch (fontWeight) {
    case "bold": return "font-bold";
    case "black": return "font-black";
    default: return "font-semibold";
  }
};

export default function LeaderboardTab({ mappackId, mappackRanks, loggedInMappack }: LeaderboardTabProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<{
    playerId: string;
    playerName: string;
  } | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const fetchLeaderboard = async (currentOffset: number, append: boolean = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const response = await axios.get(
        `${API_BASE}/mappacks/${mappackId}/leaderboard?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`
      );
      const newData = response.data;
      append ? setLeaderboard((prev) => [...prev, ...newData]) : setLeaderboard(newData);
      setHasMore(newData.length === ITEMS_PER_PAGE);
      setOffset(currentOffset + newData.length);
    } catch (err) {
      console.log("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(0, false);
  }, [mappackId]);

  const playersByRank = leaderboard.reduce((acc, entry) => {
    const rank = getPlayerRank(entry.total_points, mappackRanks);
    const rankName = rank?.name || "Unranked";
    if (!acc[rankName]) acc[rankName] = { rank, players: [] };
    acc[rankName].players.push(entry);
    return acc;
  }, {} as Record<string, { rank: MappackRank | null; players: LeaderboardEntry[] }>);

  const sortedRanks = Object.keys(playersByRank).sort((a, b) => {
    const pointsA = playersByRank[a].rank?.pointsNeeded || 0;
    const pointsB = playersByRank[b].rank?.pointsNeeded || 0;
    return pointsB - pointsA;
  });

  const handlePlayerClick = (playerId: string, playerName: string) => {
    setSelectedPlayer({ playerId, playerName });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="white" />
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="font-ruigslay text-neutral-600 text-xl">No players yet</p>
      </div>
    );
  }

  return (
    <>
      {/* Search — top right */}
      <div className="flex justify-end mb-8">
        <PlayerSearch
          mappackId={mappackId}
          onPlayerSelect={handlePlayerClick}
          placeholder="Find a player..."
          className="w-56"
        />
      </div>

      <div className="flex flex-col gap-10">
        {sortedRanks.map((rankName) => {
          const rankData = playersByRank[rankName];
          const rank = rankData.rank;
          if (!rank) return null;

          const rankColor = rank.color || "#6b7280";
          const borderColorToUse = rank.borderColor || rankColor;
          const glowOpacity = Math.min(100, Math.max(0, rank.glowIntensity || 50)) / 100;

          let globalPosition = 0;
          for (const r of sortedRanks) {
            if (r === rankName) break;
            globalPosition += playersByRank[r].players.length;
          }

          return (
            <div key={rankName}>
              {/* Rank section header — prestigious */}
              <div className="flex flex-col items-center mb-8 pt-2">
                {rank.backgroundGlow && (
                  <div
                    className="absolute blur-3xl w-64 h-16 pointer-events-none"
                    style={{ backgroundColor: rankColor, opacity: glowOpacity * 0.25 }}
                  />
                )}
                <h2
                  className={`relative text-center ${Casko.className}`}
                  style={{
                    fontSize: "clamp(36px, 6vw, 64px)",
                    letterSpacing: "0.08em",
                    color: rankColor,
                    textShadow: rank.textShadow
                      ? `0 0 40px ${rankColor}${Math.round(glowOpacity * 128).toString(16).padStart(2, "0")}, 0 0 80px ${rankColor}${Math.round(glowOpacity * 64).toString(16).padStart(2, "0")}`
                      : `0 0 60px ${rankColor}20`,
                  }}
                >
                  {rank.symbolsAround} {rankName.toUpperCase()} {rank.symbolsAround}
                </h2>
                {/* Decorative lines flanking the title */}
                <div className="flex items-center gap-4 mt-3 w-full max-w-sm">
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${rankColor}40)` }} />
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `${rankColor}60` }} />
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${rankColor}40)` }} />
                </div>
              </div>

              {/* Player cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rankData.players.map((entry, index) => {
                  const position = globalPosition + index + 1;
                  const isTopThree = position <= 3;
                  const cardStyleEffects = getCardStyleEffects(rank.cardStyle, rankColor);
                  const animationClass = getAnimationClass(rank.animationType);
                  const patternBg = getBackgroundPattern(rank.backgroundPattern, rankColor);
                  const fontSizeClass = getFontSizeClass(rank.fontSize);
                  const fontWeightClass = getFontWeightClass(rank.fontWeight);

                  if (rank.invertedColor) {
                    return (
                      <div
                        key={entry.player_id}
                        onClick={() => handlePlayerClick(entry.player_id, entry.player.name)}
                        className={`relative p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] overflow-hidden cursor-pointer ${animationClass}`}
                        style={{
                          background: cardStyleEffects.background || `linear-gradient(135deg, ${rankColor}dd, ${rankColor}aa)`,
                          border: `${rank.borderWidth || 2}px solid ${borderColorToUse}`,
                          boxShadow: rank.backgroundGlow
                            ? `0 0 ${20 * glowOpacity}px ${rankColor}${Math.round(glowOpacity * 96).toString(16).padStart(2, "0")}`
                            : "none",
                          backgroundImage: patternBg,
                          backgroundSize: rank.backgroundPattern === "dots" || rank.backgroundPattern === "grid" ? "20px 20px" : "auto",
                          filter: cardStyleEffects.filter,
                          animation: cardStyleEffects.animation,
                        }}
                      >
                        {rank.animationType === "shine" && (
                          <div className="absolute inset-0 opacity-30 animate-shine-move"
                            style={{ background: "linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)" }}
                          />
                        )}
                        <span className="absolute top-2.5 right-3 font-ruigslay text-sm" style={{ color: `${rankColor}25` }}>
                          #{position}
                        </span>
                        <div className="flex items-baseline gap-3 relative z-10 pr-8">
                          <p
                            className="font-ruigslay leading-none text-black shrink-0"
                            style={{
                              fontSize: "clamp(28px, 4vw, 40px)",
                              textShadow: rank.textShadow ? `0 0 10px ${rankColor}` : "none",
                            }}
                          >
                            {entry.total_points}
                          </p>
                          <p className={`${fontSizeClass} ${fontWeightClass} leading-tight text-black truncate`}
                            style={{ textShadow: rank.textShadow ? `0 0 10px ${rankColor}40` : "none" }}>
                            {entry.player.name}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={entry.player_id}
                      onClick={() => handlePlayerClick(entry.player_id, entry.player.name)}
                      className={`relative p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden ${animationClass} ${
                        isTopThree ? "bg-white/[0.07]" : "bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                      style={{
                        border: `${rank.borderWidth || 1}px solid ${isTopThree ? `${borderColorToUse}35` : "rgba(255,255,255,0.06)"}`,
                        boxShadow: rank.backgroundGlow && isTopThree
                          ? `0 0 ${20 * glowOpacity}px ${rankColor}${Math.round(glowOpacity * 96).toString(16).padStart(2, "0")}`
                          : "none",
                        backgroundImage: patternBg,
                        backgroundSize: rank.backgroundPattern === "dots" || rank.backgroundPattern === "grid" ? "20px 20px" : "auto",
                        ...cardStyleEffects,
                      }}
                    >
                      {rank.animationType === "shine" && (
                        <div className="absolute inset-0 opacity-20 animate-shine-move"
                          style={{ background: "linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)" }}
                        />
                      )}
                      <span className="absolute top-2.5 right-3 font-ruigslay text-sm text-white/20">
                        #{position}
                      </span>
                      <div className="flex items-baseline gap-3 relative z-10 pr-8">
                        <p
                          className="font-ruigslay leading-none shrink-0"
                          style={{
                            fontSize: "clamp(28px, 4vw, 40px)",
                            color: rankColor,
                            textShadow: rank.textShadow ? `0 0 10px ${rankColor}80` : "none",
                          }}
                        >
                          {entry.total_points}
                        </p>
                        <p className={`text-white leading-tight truncate ${fontSizeClass} ${fontWeightClass}`}
                          style={{ textShadow: rank.textShadow ? `0 0 10px ${rankColor}40` : "none" }}>
                          {entry.player.name}
                        </p>
                      </div>
                      {isTopThree && (
                        <div className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
                          style={{ background: `radial-gradient(circle at top right, ${rankColor}80, transparent)` }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center pt-4 pb-8">
            <Button
              onPress={() => fetchLeaderboard(offset, true)}
              isLoading={loadingMore}
              variant="bordered"
              className="border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 px-10"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shine-move {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        .animate-shine-move { animation: shine-move 3s infinite; }
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        @keyframes holographic {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      {selectedPlayer && (
        <PlayerDetailModal
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          playerId={selectedPlayer.playerId}
          playerName={selectedPlayer.playerName}
          mappackId={mappackId}
          loggedInMappack={loggedInMappack}
        />
      )}
    </>
  );
}