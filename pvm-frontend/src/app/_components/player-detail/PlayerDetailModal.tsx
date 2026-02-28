"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Spinner,
} from "@heroui/react";
import { motion } from "framer-motion";
import { Mappack } from "@/types/mappack.types";
import { mappackService } from "@/services/mappack.service";
import { groupTracksByTier, sortTiersByPoints } from "@/utils/mappack.utils";
import { calculateCompletionStats } from "@/utils/player.utils";

import { TrackRow } from "./TrackRow";
import { ModalPlayerStats } from "./ModalPlayerStats";
import { MappackProgressBar } from "../mappack-page/MappackProgressBar";
import { useTierScroll } from "@/hooks/useTierScroll";
import { TierSection } from "../TierSection";
import { IoGrid, IoList } from "react-icons/io5";

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

  const playerMappackTracks = playerMappack?.MappackTrack ?? [];
  const tracksByTier = groupTracksByTier(playerMappackTracks);
  const sortedTiers = sortTiersByPoints(tracksByTier, "asc");
  const { tierRefs } = useTierScroll(tracksByTier);

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

  const { current, total } = playerMappack
    ? calculateCompletionStats(playerMappack.MappackTrack)
    : { current: 0, total: 0 };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-neutral-900",
        body: "p-0",
      }}
    >
      <ModalContent>
        <ModalBody>
          {loading || !playerMappack ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : (
            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* ─── Stats header ─────────────────────────────────── */}
              <div className="px-6 pt-6">
                <ModalPlayerStats
                  mappackId={mappackId}
                  playerId={playerId}
                  playerName={playerName}
                  ranks={playerMappack.mappackRanks}
                />
              </div>

              {/* ─── Progress bar ─────────────────────────────────── */}
              <div className="px-6 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-widest uppercase text-white/30 text-label">
                    Progress
                  </span>
                </div>
                <MappackProgressBar
                  completionCurrent={current}
                  completionTotal={total}
                />
              </div>

              {/* ─── Divider ──────────────────────────────────────── */}
              <div className="h-px bg-white/[0.06]" />

              {/* ─── View toggle ──────────────────────────────────── */}
              <div className="flex justify-end px-6">
                <button
                  onClick={() => setIsListView(!isListView)}
                  className="
                    w-10 h-10
                    flex items-center justify-center
                    bg-white/5 hover:bg-white/10
                    border border-white/10 hover:border-white/20
                    rounded-lg
                    transition-all duration-200
                    hover:scale-105 active:scale-95
                    cursor-pointer group
                  "
                  aria-label="Switch View"
                >
                  {isListView ? (
                    <IoList className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  ) : (
                    <IoGrid className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  )}
                </button>
              </div>

              {/* ─── Tracks ───────────────────────────────────────── */}
              <div className="px-6 pb-6">
                {isListView ? (
                  <div className="flex flex-col gap-6">
                    {sortedTiers.map((tierName) => {
                      const tierData = tracksByTier[tierName];
                      if (!tierData.tier) return null;
                      return (
                        <div key={tierName} className="flex flex-col gap-3">
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
                ) : (
                  <>
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
                )}
              </div>
            </motion.div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}