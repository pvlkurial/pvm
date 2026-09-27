import { useState, useEffect } from "react";
import { MappackTrack } from "@/types/mappack.types";
import { filterTracksByTimeGoal } from "@/utils/track-filter.utils";
import { useStoredState } from "./useStoredState";

/**
 * Filters tracks down to those where a chosen time goal is still unachieved.
 * The choice is only applied (and remembered) once confirmed with applyFilter.
 */
export function useTrackFilter(
  tracks: MappackTrack[],
  onFilterChange: (filteredTracks: MappackTrack[]) => void,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedTimeGoal, setAppliedTimeGoal] = useStoredState<number | null>(
    "track-filter-time-goal",
    null,
    Number,
  );
  const [selectedTimeGoal, setSelectedTimeGoal] = useState(appliedTimeGoal);

  // Re-apply the remembered filter whenever the track list is (re)loaded.
  useEffect(() => {
    if (tracks.length === 0) return;
    onFilterChange(filterTracksByTimeGoal(tracks, appliedTimeGoal));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks]);

  const apply = (timeGoalId: number | null) => {
    setAppliedTimeGoal(timeGoalId);
    onFilterChange(filterTracksByTimeGoal(tracks, timeGoalId));
    setIsOpen(false);
  };

  const toggleTimeGoal = (id: number) => {
    setSelectedTimeGoal((prev) => (prev === id ? null : id));
  };

  const clearFilter = () => {
    setSelectedTimeGoal(null);
    apply(null);
  };

  return {
    isOpen,
    setIsOpen,
    selectedTimeGoal,
    applyFilter: () => apply(selectedTimeGoal),
    clearFilter,
    toggleTimeGoal,
    isFilterActive: appliedTimeGoal !== null,
  };
}
