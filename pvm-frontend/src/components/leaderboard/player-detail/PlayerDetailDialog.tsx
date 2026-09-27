"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoGrid, IoList } from "react-icons/io5";
import { Mappack } from "@/types/mappack.types";
import { mappackService } from "@/services/mappack.service";
import { groupTracksByTier, sortTiersByPoints } from "@/utils/mappack.utils";
import { calculateCompletionStats } from "@/utils/player.utils";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { CompletionBar } from "@/components/common/CompletionBar";
import { TrackCard } from "@/components/track-card/TrackCard";
import { ModalPlayerStats } from "./ModalPlayerStats";
import { TierHeading } from "./TierHeading";
import { TrackRow } from "./TrackRow";
import { TrackRowHeader } from "./TrackRowHeader";

interface PlayerDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playerId: string;
  playerName: string;
  mappackId: string;
  /** The signed-in player's own progress, to compare against. */
  loggedInMappack?: Mappack;
}

function ViewToggle({
  isListView,
  onChange,
}: {
  isListView: boolean;
  onChange: (isListView: boolean) => void;
}) {
  const option = (active: boolean) =>
    cn(
      "cursor-pointer transition-colors",
      active ? "text-foreground" : "text-faint hover:text-muted-foreground",
    );

  return (
    <div className="flex justify-end gap-3 px-6" role="group">
      <button
        type="button"
        onClick={() => onChange(true)}
        aria-pressed={isListView}
        title="List view"
        className={option(isListView)}
      >
        <IoList className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        aria-pressed={!isListView}
        title="Tile view"
        className={option(!isListView)}
      >
        <IoGrid className="size-5" />
      </button>
    </div>
  );
}

export function PlayerDetailDialog({
  isOpen,
  onClose,
  playerId,
  playerName,
  mappackId,
  loggedInMappack,
}: PlayerDetailDialogProps) {
  const [playerMappack, setPlayerMappack] = useState<Mappack | null>(null);
  const [loading, setLoading] = useState(true);
  const [isListView, setIsListView] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    mappackService
      .getMappack(mappackId, playerId)
      .then(setPlayerMappack)
      .catch((error) => console.error("Error fetching player data:", error))
      .finally(() => setLoading(false));
  }, [isOpen, playerId, mappackId]);

  const tracksByTier = groupTracksByTier(playerMappack?.MappackTrack ?? []);
  const sortedTiers = sortTiersByPoints(tracksByTier, "asc");
  const completion = calculateCompletionStats(playerMappack?.MappackTrack ?? []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl overflow-y-auto">
        <DialogTitle className="sr-only">{playerName}</DialogTitle>

        {loading || !playerMappack ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-8" />
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pt-6">
              <ModalPlayerStats
                mappackId={mappackId}
                playerId={playerId}
                playerName={playerName}
                ranks={playerMappack.mappackRanks}
              />
            </div>

            <div className="px-6">
              <CompletionBar {...completion} />
            </div>

            <hr className="border-border-subtle" />

            <ViewToggle isListView={isListView} onChange={setIsListView} />

            <div className="flex flex-col gap-6 px-6 pb-6">
              {sortedTiers.map((tierName) => {
                const tierData = tracksByTier[tierName];
                return (
                  <div key={tierName} className="flex flex-col gap-3">
                    <TierHeading tierName={tierName} tier={tierData.tier} />

                    {isListView ? (
                      <div className="flex flex-col gap-2">
                        <TrackRowHeader withComparison={!!loggedInMappack} />
                        {tierData.tracks.map((track) => (
                          <TrackRow
                            key={track.track_id}
                            track={track}
                            playerMappack={playerMappack}
                            loggedInMappack={loggedInMappack}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {tierData.tracks.map((track) => (
                          <TrackCard
                            key={track.track_id}
                            mappackTrack={track}
                            timeGoalDefinitions={playerMappack.timeGoals}
                            mappackId={mappackId}
                            alwaysShowDetails
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
