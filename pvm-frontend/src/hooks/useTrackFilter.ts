import { useState } from 'react';
import { MappackTrack } from '@/types/mappack.types';
import { filterTracksByTimeGoal } from '@/utils/track-filter.utils';

export function useTrackFilter(
  tracks: MappackTrack[],
  onFilterChange: (filtered: MappackTrack[]) => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimeGoal, setSelectedTimeGoal] = useState<number | null>(null);

  const applyFilter = () => {
    const filtered = filterTracksByTimeGoal(tracks, selectedTimeGoal);
    onFilterChange(filtered);
    setIsOpen(false);
  };

  const clearFilter = () => {
    setSelectedTimeGoal(null);
    onFilterChange(tracks);
    setIsOpen(false);
  };

  const toggleTimeGoal = (timeGoalId: number) => {
    setSelectedTimeGoal(selectedTimeGoal === timeGoalId ? null : timeGoalId);
  };

  return {
    isOpen,
    setIsOpen,
    selectedTimeGoal,
    applyFilter,
    clearFilter,
    toggleTimeGoal,
    isFilterActive: selectedTimeGoal !== null,
  };
}