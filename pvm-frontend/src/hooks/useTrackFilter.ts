import { useState, useCallback } from "react";
import { MappackTrack } from "@/types/mappack.types";

export function useTrackFilter(
  tracks: MappackTrack[],
  onFilterChange: (filteredTracks: MappackTrack[]) => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimeGoal, setSelectedTimeGoal] = useState<number | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const toggleTimeGoal = useCallback((id: number) => {
    setSelectedTimeGoal((prev) => (prev === id ? null : id));
  }, []);

  const applyFilter = useCallback(() => {
    if (selectedTimeGoal === null) {
      onFilterChange(tracks);
      setIsFilterActive(false);
    } else {
      const filtered = tracks.filter((track) => {
        const timeGoalTrack = track.timeGoalMappackTrack?.find(
          (tg) => tg.time_goal_id === selectedTimeGoal
        );
        return !timeGoalTrack || !timeGoalTrack.is_achieved;
      });
      onFilterChange(filtered);
      setIsFilterActive(true);
    }
    setIsOpen(false);
  }, [tracks, selectedTimeGoal, onFilterChange]);

  const clearFilter = useCallback(() => {
    setSelectedTimeGoal(null);
    setIsFilterActive(false);
    onFilterChange(tracks);
    setIsOpen(false);
  }, [tracks, onFilterChange]);

  return {
    isOpen,
    setIsOpen,
    selectedTimeGoal,
    applyFilter,
    clearFilter,
    toggleTimeGoal,
    isFilterActive,
  };
}