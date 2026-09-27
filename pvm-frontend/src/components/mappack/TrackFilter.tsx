"use client";
import { FaFilter } from "react-icons/fa6";
import { TimeGoal, MappackTrack } from "@/types/mappack.types";
import { useTrackFilter } from "@/hooks/useTrackFilter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TrackFilterPanel } from "./TrackFilterPanel";

interface TrackFilterProps {
  timeGoals: TimeGoal[];
  tracks: MappackTrack[];
  onFilterChange: (filteredTracks: MappackTrack[]) => void;
}

export function TrackFilter({
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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Filter tracks"
          className={cn(
            isFilterActive &&
              "border-primary bg-primary text-primary-foreground hover:bg-primary/85",
          )}
        >
          <FaFilter />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[380px] p-0">
        <TrackFilterPanel
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
