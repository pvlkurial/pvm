import { useState, useCallback, useEffect } from "react";
import { MappackTrack } from "@/types/mappack.types";

const STORAGE_KEY = "track-filter-time-goal";

export function useTrackFilter(
  tracks: MappackTrack[],
  onFilterChange: (filteredTracks: MappackTrack[]) => void,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimeGoal, setSelectedTimeGoal] = useState<number | null>(
    () => {
      if (typeof window === "undefined") return null;
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? Number(stored) : null;
    },
  );
  const [isFilterActive, setIsFilterActive] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) !== null;
  });

  // Apply stored filter on mount once tracks are available
  useEffect(() => {
    if (tracks.length === 0) return;
    if (selectedTimeGoal === null) {
      onFilterChange(tracks);
    } else {
      const filtered = tracks.filter((track) => {
        const timeGoalTrack = track.timeGoalMappackTrack?.find(
          (tg) => tg.time_goal_id === selectedTimeGoal,
        );
        return !timeGoalTrack || !timeGoalTrack.is_achieved;
      });
      onFilterChange(filtered);
    }
  }, [tracks]);

  const toggleTimeGoal = useCallback((id: number) => {
    setSelectedTimeGoal((prev) => (prev === id ? null : id));
  }, []);

  const applyFilter = useCallback(() => {
    if (selectedTimeGoal === null) {
      localStorage.removeItem(STORAGE_KEY);
      onFilterChange(tracks);
      setIsFilterActive(false);
    } else {
      localStorage.setItem(STORAGE_KEY, String(selectedTimeGoal));
      const filtered = tracks.filter((track) => {
        const timeGoalTrack = track.timeGoalMappackTrack?.find(
          (tg) => tg.time_goal_id === selectedTimeGoal,
        );
        return !timeGoalTrack || !timeGoalTrack.is_achieved;
      });
      onFilterChange(filtered);
      setIsFilterActive(true);
    }
    setIsOpen(false);
  }, [tracks, selectedTimeGoal, onFilterChange]);

  const clearFilter = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
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
