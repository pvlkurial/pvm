"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Card, CardBody, Chip } from "@heroui/react";

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

interface LeaderboardPanelProps {
  mappackId: string;
}

interface PlayerRank {
  name: string;
  color: string;
  minPoints: number;
}

// Define your rank system here - customize thresholds as needed
const RANKS: PlayerRank[] = [
  { name: "Grandmaster", color: "#FF0080", minPoints: 2000 },
  { name: "Master", color: "#8B00FF", minPoints: 1500 },
  { name: "Diamond", color: "#00D9FF", minPoints: 1000 },
  { name: "Platinum", color: "#00FFA3", minPoints: 750 },
  { name: "Gold", color: "#FFD700", minPoints: 500 },
  { name: "Silver", color: "#C0C0C0", minPoints: 250 },
  { name: "Bronze", color: "#CD7F32", minPoints: 100 },
  { name: "Beginner", color: "#6B7280", minPoints: 0 },
];

const getPlayerRank = (points: number): PlayerRank => {
  for (const rank of RANKS) {
    if (points >= rank.minPoints) {
      return rank;
    }
  }
  return RANKS[RANKS.length - 1];
};

export default function LeaderboardPanel({ mappackId }: LeaderboardPanelProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/mappacks/${mappackId}/leaderboard?limit=100`)
      .then((response) => {
        setLeaderboard(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching leaderboard:", err);
        setLoading(false);
      });
  }, [mappackId]);

  if (loading) {
    return (
      <div className="lg:sticky lg:top-4 lg:self-start">
        <Card className="bg-neutral-800">
          <CardBody className="p-6">
            <div className="flex justify-center items-center h-40">
              <Spinner size="lg" />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-4 lg:self-start max-h-[90vh] flex flex-col">
      <Card className="bg-neutral-800 flex-1 flex flex-col">
        <CardBody className="p-6 flex flex-col flex-1 overflow-hidden">
          <div className="mb-6">
            <h3 className="text-2xl font-ruigslay font-bold">LEADERBOARD</h3>
          </div>

          {leaderboard.length > 0 ? (
            <div 
              className="overflow-y-auto flex-1"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div className="flex flex-col gap-2">
                {leaderboard.map((entry, index) => {
                  const position = index + 1;
                  const rank = getPlayerRank(entry.total_points);
                  const isTopThree = position <= 3;

                  return (
                    <div
                      key={entry.player_id}
                      className={`relative p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                        isTopThree
                          ? "bg-gradient-to-r from-white/10 to-white/5 border border-white/20"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {/* Position - top right corner */}
                      <div className="absolute top-2 right-2">
                        <span className="text-xs text-white/30 font-mono">
                          #{position}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Points - left side, prominent */}
                        <div className="flex-shrink-0 text-left">
                          <p className="font-bold text-2xl font-mono text-green-400 leading-none">
                            {entry.total_points}
                          </p>
                          <p className="text-xs text-white/40 uppercase tracking-wider mt-1">
                            pts
                          </p>
                        </div>

                        {/* Player Info - takes remaining space */}
                        <div className="flex-1 min-w-0 pr-6">
                          {/* Player Name */}
                          <p className="font-bold text-lg text-white leading-tight mb-2">
                            {entry.player.name}
                          </p>
                          
                          {/* Rank Badge - below name */}
                          <Chip
                            size="sm"
                            variant="flat"
                            className="text-xs font-semibold"
                            style={{
                              backgroundColor: `${rank.color}20`,
                              color: rank.color,
                              borderColor: `${rank.color}40`,
                            }}
                          >
                            {rank.name}
                          </Chip>
                        </div>
                      </div>

                      {/* Top 3 subtle glow effect */}
                      {isTopThree && (
                        <div
                          className="absolute inset-0 rounded-lg opacity-10 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at top right, ${rank.color}80, transparent)`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-8">
                <p className="text-white/50 text-lg">No rankings yet</p>
                <p className="text-white/30 text-sm mt-2">
                  Complete tracks to appear on the leaderboard
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}