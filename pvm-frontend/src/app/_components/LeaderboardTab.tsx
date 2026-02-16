"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Spinner, Button } from "@heroui/react";
import { Casko } from "@/fonts";
import { MappackRank, Mappack } from "@/types/mappack.types";
import PlayerDetailModal from "./player-detail/PlayerDetailModal";

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

const ITEMS_PER_PAGE = 5;

const getPlayerRank = (points: number, ranks: MappackRank[]): MappackRank | null => {
  const sortedRanks = [...ranks].sort((a, b) => b.pointsNeeded - a.pointsNeeded);
  
  for (const rank of sortedRanks) {
    if (points >= rank.pointsNeeded) {
      return rank;
    }
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
  const [activeRank, setActiveRank] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<{
    playerId: string;
    playerName: string;
  } | null>(null);
  const rankRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const fetchLeaderboard = async (currentOffset: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `${API_BASE}/mappacks/${mappackId}/leaderboard?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`
      );

      const newData = response.data;

      if (append) {
        setLeaderboard((prev) => [...prev, ...newData]);
      } else {
        setLeaderboard(newData);
      }

      // If we got less than ITEMS_PER_PAGE, there's no more data
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

  const handleLoadMore = () => {
    fetchLeaderboard(offset, true);
  };

  // Group players by rank
  const playersByRank = leaderboard.reduce((acc, entry) => {
    const rank = getPlayerRank(entry.total_points, mappackRanks);
    const rankName = rank?.name || "Unranked";
    
    if (!acc[rankName]) {
      acc[rankName] = {
        rank: rank,
        players: [],
      };
    }
    acc[rankName].players.push(entry);
    return acc;
  }, {} as Record<string, { rank: MappackRank | null; players: LeaderboardEntry[] }>);

  // Sort ranks by points needed (descending)
  const sortedRanks = Object.keys(playersByRank).sort((a, b) => {
    const pointsA = playersByRank[a].rank?.pointsNeeded || 0;
    const pointsB = playersByRank[b].rank?.pointsNeeded || 0;
    return pointsB - pointsA;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveRank(entry.target.getAttribute("data-rank") || "");
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    );

    Object.values(rankRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [playersByRank]);

  const handlePlayerClick = (playerId: string, playerName: string) => {
    setSelectedPlayer({ playerId, playerName });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-white/50 text-lg">No players yet</p>
          <p className="text-white/30 text-sm mt-2">
            Complete tracks to appear on the leaderboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        {sortedRanks.map((rankName) => {
          const rankData = playersByRank[rankName];
          const rank = rankData.rank;
          if (!rank) return null;
          
          const rankColor = rank.color || "#6b7280";
          const borderColorToUse = rank.borderColor || rankColor;
          const glowOpacity = Math.min(100, Math.max(0, rank.glowIntensity || 50)) / 100;
          let globalPosition = 0;
          
          // Calculate starting position for this rank
          for (const r of sortedRanks) {
            if (r === rankName) break;
            globalPosition += playersByRank[r].players.length;
          }

          return (
            <div
              key={rankName}
              ref={(el) => {
                rankRefs.current[rankName] = el;
              }}
              data-rank={rankName}
              className="scroll-mt-4"
            >
              {/* Rank Header */}
              <div className="mb-6 pt-4 justify-center items-center flex">
                <div className="relative">
                  {rank.backgroundGlow && (
                    <div 
                      className="absolute inset-0 blur-xl"
                      style={{ 
                        backgroundColor: rankColor,
                        opacity: glowOpacity * 0.5
                      }}
                    />
                  )}
                  <h2
                    className={`text-4xl justify-center ${Casko.className} relative`}
                    style={{ 
                      color: rankColor,
                      textShadow: rank.textShadow ? `0 0 20px ${rankColor}${Math.round(glowOpacity * 128).toString(16).padStart(2, '0')}` : 'none'
                    }}
                  >
                    {rank.symbolsAround} {rankName.toUpperCase()} {rank.symbolsAround}
                  </h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rankData.players.map((entry, index) => {
                  const position = globalPosition + index + 1;
                  const isTopThree = position <= 3;
                  const cardStyleEffects = getCardStyleEffects(rank.cardStyle, rankColor);
                  const animationClass = getAnimationClass(rank.animationType);
                  const patternBg = getBackgroundPattern(rank.backgroundPattern, rankColor);
                  const fontSizeClass = getFontSizeClass(rank.fontSize);
                  const fontWeightClass = getFontWeightClass(rank.fontWeight);

                  // INVERTED COLOR STYLE
                  if (rank.invertedColor) {
                    return (
                      <div
                        key={entry.player_id}
                        onClick={() => handlePlayerClick(entry.player_id, entry.player.name)}
                        className={`relative p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden cursor-pointer ${animationClass}`}
                        style={{
                          background: cardStyleEffects.background || `linear-gradient(135deg, ${rankColor}dd, ${rankColor}aa)`,
                          border: `${rank.borderWidth || 2}px solid ${borderColorToUse}`,
                          boxShadow: rank.backgroundGlow 
                            ? `0 0 ${20 * glowOpacity}px ${rankColor}${Math.round(glowOpacity * 96).toString(16).padStart(2, '0')}`
                            : 'none',
                          backgroundImage: patternBg,
                          backgroundSize: rank.backgroundPattern === "dots" ? "20px 20px" : rank.backgroundPattern === "grid" ? "20px 20px" : "auto",
                          filter: cardStyleEffects.filter,
                          animation: cardStyleEffects.animation,
                        }}
                      >
                        {rank.animationType === "shine" && (
                          <div 
                            className="absolute inset-0 opacity-30 animate-shine-move"
                            style={{
                              background: `linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)`,
                            }}
                          />
                        )}
                        
                        <div className="absolute top-2 right-2">
                          <span 
                            className="text-xs font-mono font-bold"
                            style={{ color: `${rankColor}20` }}
                          >
                            #{position}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 relative z-10">
                          <div className="flex-shrink-0 text-left">
                            <p 
                              className="font-bold text-2xl font-mono leading-none"
                              style={{ 
                                color: '#000000',
                                textShadow: rank.textShadow ? `0 0 10px ${rankColor}` : 'none'
                              }}
                            >
                              {entry.total_points}
                            </p>
                            <p className="text-xs uppercase tracking-wider mt-1 text-black/60">
                              pts
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 pr-6">
                            <p 
                              className={`${fontSizeClass} ${fontWeightClass} leading-tight`}
                              style={{ 
                                color: '#000000',
                                textShadow: rank.textShadow ? `0 0 10px ${rankColor}40` : 'none'
                              }}
                            >
                              {entry.player.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // NORMAL STYLE
                  return (
                    <div
                      key={entry.player_id}
                      onClick={() => handlePlayerClick(entry.player_id, entry.player.name)}
                      className={`relative p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer ${animationClass} ${
                        isTopThree
                          ? "bg-gradient-to-r from-white/10 to-white/5"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                      style={{
                        border: `${rank.borderWidth || 1}px solid ${isTopThree ? `${borderColorToUse}40` : 'rgba(255,255,255,0.1)'}`,
                        boxShadow: rank.backgroundGlow && isTopThree
                          ? `0 0 ${20 * glowOpacity}px ${rankColor}${Math.round(glowOpacity * 96).toString(16).padStart(2, '0')}`
                          : 'none',
                        backgroundImage: patternBg,
                        backgroundSize: rank.backgroundPattern === "dots" ? "20px 20px" : rank.backgroundPattern === "grid" ? "20px 20px" : "auto",
                        ...cardStyleEffects,
                      }}
                    >
                      {rank.animationType === "shine" && (
                        <div 
                          className="absolute inset-0 opacity-20 animate-shine-move"
                          style={{
                            background: `linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)`,
                          }}
                        />
                      )}

                      <div className="absolute top-2 right-2">
                        <span className="text-xs text-white/30 font-mono">
                          #{position}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 relative z-10">
                        <div className="flex-shrink-0 text-left">
                          <p 
                            className="font-bold text-2xl font-mono text-green-400 leading-none"
                            style={{
                              textShadow: rank.textShadow ? `0 0 10px #4ade8080` : 'none'
                            }}
                          >
                            {entry.total_points}
                          </p>
                          <p className="text-xs text-white/40 uppercase tracking-wider mt-1">
                            pts
                          </p>
                        </div>

                        <div className="flex-1 min-w-0 pr-6">
                          <p 
                            className={`text-white leading-tight ${fontSizeClass} ${fontWeightClass}`}
                            style={{
                              textShadow: rank.textShadow ? `0 0 10px ${rankColor}40` : 'none'
                            }}
                          >
                            {entry.player.name}
                          </p>
                        </div>
                      </div>

                      {isTopThree && (
                        <div
                          className="absolute inset-0 rounded-lg opacity-10 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at top right, ${rankColor}80, transparent)`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center py-8">
            <Button
              onClick={handleLoadMore}
              isLoading={loadingMore}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-8 py-6 text-lg"
              size="lg"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
        
        <style jsx>{`
          @keyframes shine-move {
            0% {
              transform: translateX(-100%) translateY(-100%) rotate(45deg);
            }
            100% {
              transform: translateX(100%) translateY(100%) rotate(45deg);
            }
          }
          
          .animate-shine-move {
            animation: shine-move 3s infinite;
          }
          
          @keyframes shimmer {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }
          
          @keyframes holographic {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      </div>

      {/* Player Detail Modal */}
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