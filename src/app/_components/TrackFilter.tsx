"use client";
import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@heroui/react";

interface TimeGoal {
  id: number;
  name: string;
  multiplier: number;
}

interface TimeGoalMappackTrack {
  time_goal_id: number;
  time: number;
  is_achieved?: boolean;
  player_time?: number;
}

interface MappackTrack {
  mappack_id: string;
  track_id: string;
  track: any;
  timeGoalMappackTrack: TimeGoalMappackTrack[];
  tier: any;
  mapStyle: string;
  personal_best?: number;
}

interface TrackFilterProps {
  timeGoals: TimeGoal[];
  tracks: MappackTrack[];
  onFilterChange: (filteredTracks: MappackTrack[]) => void;
}

export default function TrackFilter({ timeGoals, tracks, onFilterChange }: TrackFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimeGoal, setSelectedTimeGoal] = useState<number | null>(null);

  const applyFilter = () => {
    if (selectedTimeGoal === null) {
      onFilterChange(tracks);
      setIsOpen(false);
      return;
    }

   const filtered = tracks.filter((track) => {
  const timeGoalStatus = track.timeGoalMappackTrack?.find(
    (tg) => tg.time_goal_id === selectedTimeGoal
  );
  return timeGoalStatus?.is_achieved !== true;
});

    onFilterChange(filtered);
    setIsOpen(false);
  };

  const clearFilter = () => {
    setSelectedTimeGoal(null);
    onFilterChange(tracks);
    setIsOpen(false);
  };

  const getNotAchievedCount = (timeGoalId: number) =>
  tracks.filter((track) => {
    const goals = track.timeGoalMappackTrack ?? [];
    const tg = goals.find(t => t.time_goal_id === timeGoalId);
    return !tg || tg.is_achieved !== true;
  }).length;

  const isFilterActive = selectedTimeGoal !== null;
  const selectedGoalName = timeGoals.find(tg => tg.id === selectedTimeGoal)?.name;

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        size="sm"
        variant="flat"
        className={`
          w-9 h-9 p-0 flex items-center justify-center
          ${isFilterActive
            ? "bg-orange-500/20 text-orange-400 border border-orange-500/50"
            : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
          }
        `}
        startContent={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        }
      >
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        size="2xl"
        classNames={{
          base: "bg-zinc-900",
          header: "bg-zinc-900 border-b border-zinc-800",
          body: "bg-zinc-900",
          footer: "bg-zinc-900 border-t border-zinc-800",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-white">Filter Tracks</h3>
                  <p className="text-sm text-zinc-500 font-normal">Show only tracks where you haven't achieved the selected time goal</p>
                </div>
              </ModalHeader>

              <ModalBody className="space-y-3">
                <p className="text-sm text-zinc-400 font-semibold">Select Time Goal</p>
                <div className="grid grid-cols-2 gap-3">
                  {timeGoals.map((timeGoal) => {
                    const notAchieved = getNotAchievedCount(timeGoal.id);
                    const isSelected = selectedTimeGoal === timeGoal.id;

                    return (
                      <button
                        key={timeGoal.id}
                        onClick={() => setSelectedTimeGoal(isSelected ? null : timeGoal.id)}
                        className={`
                          p-4 rounded-lg border transition-all
                          ${isSelected
                            ? "bg-orange-500/20 border-orange-500 text-white shadow-lg"
                            : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50"
                          }
                        `}
                      >
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-base font-semibold">{timeGoal.name}</span>
                            {isSelected && (
                              <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex items-center gap-2 w-full">
                            <Chip size="sm" className="bg-zinc-700 text-zinc-400">
                              ×{timeGoal.multiplier}
                            </Chip>
                            <Chip
                              size="sm"
                              className={`
                                ${notAchieved === 0
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-orange-500/20 text-orange-400"
                                }
                              `}
                            >
                              {notAchieved} not achieved
                            </Chip>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ModalBody>

              <ModalFooter className="flex justify-between">
                <Button
                  size="sm"
                  variant="light"
                  onPress={clearFilter}
                  className="text-zinc-400 hover:text-white"
                >
                  Clear Filter
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={onClose}
                    className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onPress={applyFilter}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    isDisabled={selectedTimeGoal === null}
                  >
                    Apply Filter
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}