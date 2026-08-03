"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalBody, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { Mappack } from "@/types/mappack.types";
import { mappackService } from "@/services/mappack.service";
import { groupTracksByTier, sortTiersByPoints } from "@/utils/mappack.utils";
import { calculateCompletionStats } from "@/utils/player.utils";

import { TrackRow } from "./TrackRow";
import { ModalPlayerStats } from "./ModalPlayerStats";
import { MappackProgressBar } from "../mappack-page/MappackProgressBar";
import { useTierScroll } from "@/hooks/useTierScroll";
import TrackCard from "../TrackCard";
import { TierHeading } from "./TierHeading";
import { TrackRowHeader } from "./TrackRowHeader";
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
                  completionCurrent={current}
                  completionTotal={total}
                />
              </div>

              {/* ─── Progress bar ─────────────────────────────────── */}
              <div className="px-6">
                <MappackProgressBar
                  completionCurrent={current}
                  completionTotal={total}
                />
              </div>

              {/* ─── Divider ──────────────────────────────────────── */}
              <div className="h-px bg-white/[0.06]" />

              {/* ─── Tracks toolbar ───────────────────────────────── */}
              <div className="flex items-center justify-between px-6">
                <span className="text-[10px] tracking-widest uppercase text-white/35 text-label">
                  Tracks
                </span>

                {/* Segmented control: both options visible, active one marked. */}
                <div
                  role="group"
                  aria-label="Track view"
                  className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/10 rounded-lg"
                >
                  <button
                    onClick={() => setIsListView(true)}
                    aria-pressed={isListView}
                    title="List view"
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                      isListView
                        ? "bg-white/15 text-white"
                        : "text-white/45 hover:text-white/80 hover:bg-white/5"
                    }`}
                  >
                    <IoList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsListView(false)}
                    aria-pressed={!isListView}
                    title="Tile view"
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                      !isListView
                        ? "bg-white/15 text-white"
                        : "text-white/45 hover:text-white/80 hover:bg-white/5"
                    }`}
                  >
                    <IoGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ─── Tracks ───────────────────────────────────────── */}
              <div className="px-6 pb-6">
                <div className="flex flex-col gap-6">
                  {sortedTiers.map((tierName) => {
                    const tierData = tracksByTier[tierName];
                    return (
                      <div
                        key={tierName}
                        ref={(el) => {
                          tierRefs.current[tierName] = el;
                        }}
                        data-tier={tierName}
                        className="flex flex-col gap-3 scroll-mt-4"
                      >
                        <TierHeading
                          tierName={tierName}
                          tier={tierData.tier}
                          trackCount={tierData.tracks.length}
                        />

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
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {tierData.tracks.map((track) => (
                              <TrackCard
                                key={track.track_id}
                                mappackTrack={track}
                                timeGoalDefinitions={
                                  playerMappack?.timeGoals ?? []
                                }
                                mappackId={mappackId}
                                alwaysShowDetails={true}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
