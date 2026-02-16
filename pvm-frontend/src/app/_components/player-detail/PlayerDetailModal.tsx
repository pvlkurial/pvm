"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Switch,
} from "@heroui/react";
import { motion } from "framer-motion";
import { Mappack, MappackTrack} from "@/types/mappack.types";
import { mappackService } from "@/services/mappack.service";
import { groupTracksByTier, sortTiersByPoints } from "@/utils/mappack.utils";
import { calculateCompletionStats } from "@/utils/player.utils";

import { TrackRow } from "./TrackRow";
import { ModalPlayerStats } from "./ModalPlayerStats";
import { MappackProgressBar } from "../mappack-page/MappackProgressBar";
import { MappackContent } from "../MappackContent";
import { useTrackFilter } from "@/hooks/useTrackFilter";
import { useTierScroll } from "@/hooks/useTierScroll";
import { TierSection } from "../TierSection";

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerId: string;
  playerName: string;
  mappackId: string;
  loggedInMappack?: Mappack;
}

export default function PlayerDetailModal({
  isOpen,
  onClose,
  playerId,
  playerName,
  mappackId,
  loggedInMappack,
}: PlayerDetailModalProps) {
  
  const [playerMappack, setPlayerMappack] = useState<Mappack | null>(null);
  const [loading, setLoading] = useState(true);
  const [isListView, setIsListView] = useState(true);
  const [filteredTracks, setFilteredTracks] = useState<MappackTrack[]>([]);
  
  const tracksByTier = groupTracksByTier(playerMappack!.MappackTrack);
  const sortedTiers = sortTiersByPoints(tracksByTier, "asc");
  
  const { activeTier, tierRefs, scrollToTier } = useTierScroll(tracksByTier);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await mappackService.getMappack(mappackId, playerId);
        setPlayerMappack(data);
        setFilteredTracks(data.MappackTrack)
      } catch (error) {
        console.error("Error fetching player data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, playerId, mappackId]);

  if (!playerMappack || loading) {
    return (

        <Spinner size="lg" />

    );
  }

  const { current, total, percentage } = calculateCompletionStats(
    playerMappack.MappackTrack
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-neutral-900",
        header: "border-b border-white/10",
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white">{playerName}</h2>
        </ModalHeader>
        <ModalBody>
          {/* Player Stats */}
          <ModalPlayerStats
            mappackId={mappackId}
            playerId={playerId}
            ranks={playerMappack.mappackRanks}
          />

          {/* Progress Bar */}
          <MappackProgressBar 
            completionCurrent={current}
            completionTotal={total}
          />

          {/* Tracks by Tier */}
          <Switch
            isSelected={isListView}
            onValueChange={setIsListView}
            size="sm"
            classNames={{
            wrapper: "group-data-[selected=true]:bg-white bg-neutral-600",
          }}>List View
          </Switch>
          {
            isListView
              ? (
                <div className="flex flex-col gap-6">
            {sortedTiers.map((tierName) => {
              const tierData = tracksByTier[tierName];
              if (!tierData.tier) return null;

              return (
                <div key={tierName} className="flex flex-col gap-3">
                  {/* Tier Header */}
                  <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tierData.tier.color }}
                      />
                    <h3 className="text-lg font-bold text-white uppercase">
                      {tierName}
                    </h3>
                    <span className="text-sm text-white/50">
                      {tierData.tier.points} pts
                    </span>
                  </div>

                  {/* Tracks List */}
                  <div className="flex flex-col gap-2">
                    {tierData.tracks.map((track) => (
                      <TrackRow
                      key={track.track_id}
                      track={track}
                      playerMappack={playerMappack}
                      loggedInMappack={loggedInMappack}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          )
          : (<>
            {sortedTiers.map((tierName) => {
                          const tierData = tracksByTier[tierName];
                          return (
                            <TierSection
                              key={tierName}
                              tierName={tierName}
                              tierData={tierData}
                              timeGoals={playerMappack?.timeGoals ?? []}
                              mappackId={mappackId}
                              alwaysShowDetails={true}
                              onRef={(el) => {
                                tierRefs.current[tierName] = el;
                              }}
                            />
                          );
                        })}
                        </>
          )
          }
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}