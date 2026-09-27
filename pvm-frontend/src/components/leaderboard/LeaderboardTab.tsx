"use client";
import { useState, useEffect, useMemo } from "react";
import { MappackRank, Mappack, LeaderboardEntry } from "@/types/mappack.types";
import { mappackService } from "@/services/mappack.service";
import { getLeaderboardRank } from "@/utils/mappack.utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PlayerDetailDialog } from "./player-detail/PlayerDetailDialog";
import { PlayerSearch } from "./PlayerSearch";
import { LeaderboardPlayerCard } from "./LeaderboardPlayerCard";
import { LeaderboardRankHeader } from "./LeaderboardRankHeader";
import { LeaderboardPodium, PodiumPlace } from "./LeaderboardPodium";

interface LeaderboardTabProps {
  mappackId: string;
  mappackRanks: MappackRank[];
  loggedInMappack?: Mappack;
}

interface SelectedPlayer {
  playerId: string;
  playerName: string;
}

const ITEMS_PER_PAGE = 100;
const PODIUM_SIZE = 3;

export function LeaderboardTab({
  mappackId,
  mappackRanks,
  loggedInMappack,
}: LeaderboardTabProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer | null>(null);

  const fetchPage = async (offset: number) => {
    const append = offset > 0;
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const page = await mappackService.getLeaderboard(
        mappackId,
        ITEMS_PER_PAGE,
        offset,
      );
      setLeaderboard((prev) => (append ? [...prev, ...page] : page));
      setHasMore(page.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.log("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappackId]);

  // The API returns entries ordered by points, so the leading slice is the
  // global top three. They get the podium and are left out of the groups below
  // rather than appearing twice.
  const podium: PodiumPlace[] = useMemo(() => {
    if (leaderboard.length < PODIUM_SIZE) return [];
    return leaderboard.slice(0, PODIUM_SIZE).map((entry, index) => ({
      entry,
      rank: getLeaderboardRank(entry.total_points, mappackRanks),
      position: index + 1,
    }));
  }, [leaderboard, mappackRanks]);

  // Groups in descending rank order, each carrying the running position so the
  // numbering stays continuous across group boundaries and picks up where the
  // podium left off.
  const groups = useMemo(() => {
    const remaining = leaderboard.slice(podium.length);
    const byRank = new Map<string, { rank: MappackRank; players: LeaderboardEntry[] }>();

    for (const entry of remaining) {
      const rank = getLeaderboardRank(entry.total_points, mappackRanks);
      if (!rank) continue;
      const group = byRank.get(rank.name);
      if (group) {
        group.players.push(entry);
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

  const selectPlayer = (playerId: string, playerName: string) =>
    setSelectedPlayer({ playerId, playerName });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-display text-title text-faint">No players yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex justify-end">
        <PlayerSearch
          mappackId={mappackId}
          onPlayerSelect={selectPlayer}
          placeholder="Find a player..."
          className="w-56"
        />
      </div>

      {podium.length > 0 && (
        <LeaderboardPodium places={podium} onSelect={selectPlayer} />
      )}

      <div className="flex flex-col gap-10">
        {groups.map(({ rank, players, startPosition }) => (
          <div key={rank.name}>
            <LeaderboardRankHeader rank={rank} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {players.map((entry, index) => (
                <LeaderboardPlayerCard
                  key={entry.player_id}
                  entry={entry}
                  rank={rank}
                  position={startPosition + index}
                  onSelect={selectPlayer}
                />
              ))}
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="flex justify-center pt-4 pb-8">
            <Button
              variant="outline"
              className="px-10"
              loading={loadingMore}
              onClick={() => fetchPage(leaderboard.length)}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>

      {selectedPlayer && (
        <PlayerDetailDialog
          isOpen
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
