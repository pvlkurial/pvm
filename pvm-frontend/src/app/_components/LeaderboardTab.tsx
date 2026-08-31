"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Spinner, Button } from "@heroui/react";
import { MappackRank, Mappack, LeaderboardEntry } from "@/types/mappack.types";
import { mappackService } from "@/services/mappack.service";
import PlayerDetailModal from "./player-detail/PlayerDetailModal";
import PlayerSearch from "./PlayerSearch";
import { LeaderboardPlayerCard } from "./leaderboard/LeaderboardPlayerCard";
import { LeaderboardRankHeader } from "./leaderboard/LeaderboardRankHeader";
import {
  LeaderboardPodium,
  PodiumPlace,
} from "./leaderboard/LeaderboardPodium";

interface LeaderboardTabProps {
  mappackId: string;
  mappackRanks: MappackRank[];
  loggedInMappack?: Mappack;
}

const ITEMS_PER_PAGE = 100;
const PODIUM_SIZE = 3;

/**
 * Unlike the shared getPlayerRank, a player below every threshold is bucketed
 * into the lowest rank rather than left unranked, so the leaderboard has no
 * stray group at the bottom.
 */
function getBucketRank(
  points: number,
  ranks: MappackRank[],
): MappackRank | null {
  const sorted = [...ranks].sort((a, b) => b.pointsNeeded - a.pointsNeeded);
  return (
    sorted.find((rank) => points >= rank.pointsNeeded) ??
    sorted[sorted.length - 1] ??
    null
  );
}

export default function LeaderboardTab({
  mappackId,
  mappackRanks,
  loggedInMappack,
}: LeaderboardTabProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<{
    playerId: string;
    playerName: string;
  } | null>(null);

  const fetchLeaderboard = async (currentOffset: number, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const newData = await mappackService.getLeaderboard(
        mappackId,
        ITEMS_PER_PAGE,
        currentOffset,
      );
      setLeaderboard((prev) => (append ? [...prev, ...newData] : newData));
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

  // The API returns entries ordered by points, so the leading slice is the
  // global top three. They get the podium and are left out of the groups below
  // rather than appearing twice.
  const podium: PodiumPlace[] = useMemo(() => {
    if (leaderboard.length < PODIUM_SIZE) return [];
    return leaderboard.slice(0, PODIUM_SIZE).map((entry, index) => ({
      entry,
      rank: getBucketRank(entry.total_points, mappackRanks),
      position: index + 1,
    }));
  }, [leaderboard, mappackRanks]);

  // Groups in descending rank order, each carrying the running position so the
  // numbering stays continuous across group boundaries and picks up where the
  // podium left off.
  const groups = useMemo(() => {
    const remaining = podium.length > 0 ? leaderboard.slice(PODIUM_SIZE) : leaderboard;

    const byRank = new Map<
      string,
      { rank: MappackRank; players: LeaderboardEntry[] }
    >();

    for (const entry of remaining) {
      const rank = getBucketRank(entry.total_points, mappackRanks);
      if (!rank) continue;
      const existing = byRank.get(rank.name);
      if (existing) {
        existing.players.push(entry);
      } else {
        byRank.set(rank.name, { rank, players: [entry] });
      }
    }

    let position = podium.length + 1;
    return [...byRank.values()]
      .sort((a, b) => b.rank.pointsNeeded - a.rank.pointsNeeded)
      .map((group) => {
        const startPosition = position;
        position += group.players.length;
        return { ...group, startPosition };
      });
  }, [leaderboard, mappackRanks, podium]);

  const handlePlayerClick = (playerId: string, playerName: string) =>
    setSelectedPlayer({ playerId, playerName });

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
      <div className="flex justify-end mb-8">
        <PlayerSearch
          mappackId={mappackId}
          onPlayerSelect={handlePlayerClick}
          placeholder="Find a player..."
          className="w-56"
        />
      </div>

      {podium.length > 0 && (
        <LeaderboardPodium places={podium} onSelect={handlePlayerClick} />
      )}

      <div className="flex flex-col gap-10">
        {groups.map(({ rank, players, startPosition }) => (
          <div key={rank.name}>
            <LeaderboardRankHeader rank={rank} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {players.map((entry, index) => (
                <LeaderboardPlayerCard
                  key={entry.player_id}
                  entry={entry}
                  rank={rank}
                  position={startPosition + index}
                  onSelect={handlePlayerClick}
                />
              ))}
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="flex justify-center pt-4 pb-8">
            <Button
              onPress={() => fetchLeaderboard(offset, true)}
              isLoading={loadingMore}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-10"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>

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
