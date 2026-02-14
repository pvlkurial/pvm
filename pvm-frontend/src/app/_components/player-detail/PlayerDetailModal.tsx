"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
} from "@heroui/react";
import { motion } from "framer-motion";
import { Mappack} from "@/types/mappack.types";
import { mappackService } from "@/services/mappack.service";
import { groupTracksByTier, sortTiersByPoints } from "@/utils/mappack.utils";
import { calculateCompletionStats } from "@/utils/player.utils";

import { TrackRow } from "./TrackRow";
import { ModalPlayerStats } from "./ModalPlayerStats";

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

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await mappackService.getMappack(mappackId, playerId);
        setPlayerMappack(data);
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
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
        <ModalContent>
          <ModalBody className="flex items-center justify-center h-96">
            <Spinner size="lg" />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const { current, total, percentage } = calculateCompletionStats(
    playerMappack.MappackTrack
  );

  const tracksByTier = groupTracksByTier(playerMappack.MappackTrack);
  const sortedTiers = sortTiersByPoints(tracksByTier, "asc");

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
          <div className="mb-6">
            <div className="relative h-8 rounded-full bg-neutral-700/50 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  duration: 1.2,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.2,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white/30 drop-shadow-lg">
                  COMPLETED {current}/{total}
                </span>
              </div>
            </div>
          </div>

          {/* Tracks by Tier */}
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}