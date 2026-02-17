"use client";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import { TimeGoal, MappackTrack } from "@/types/mappack.types";
import { useTrackFilter } from "@/hooks/useTrackFilter";
import { FilterPopoverContent } from "./track-filter/FilterPopoverContent";
import { FILTER_POPOVER_CLASSNAMES, getFilterButtonClassName } from "@/constants/filter-popover-styles";
import { FaFilter } from "react-icons/fa6";

interface TrackFilterProps {
  timeGoals: TimeGoal[];
  tracks: MappackTrack[];
  onFilterChange: (filteredTracks: MappackTrack[]) => void;
}

export default function TrackFilter({
  timeGoals,
  tracks,
  onFilterChange,
}: TrackFilterProps) {
  const {
    isOpen,
    setIsOpen,
    selectedTimeGoal,
    applyFilter,
    clearFilter,
    toggleTimeGoal,
    isFilterActive,
  } = useTrackFilter(tracks, onFilterChange);

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-start"
      classNames={FILTER_POPOVER_CLASSNAMES}
    >
      <PopoverTrigger>
        <button
          className={getFilterButtonClassName(isFilterActive)}
        >
          <FaFilter></FaFilter>
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-zinc-900">
        <FilterPopoverContent
          timeGoals={timeGoals}
          tracks={tracks}
          selectedTimeGoal={selectedTimeGoal}
          onToggleTimeGoal={toggleTimeGoal}
          onApply={applyFilter}
          onClear={clearFilter}
        />
      </PopoverContent>
    </Popover>
  );
}