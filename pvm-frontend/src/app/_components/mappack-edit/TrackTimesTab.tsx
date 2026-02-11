// components/mappack-edit/TrackTimesTab.tsx
import { useEffect } from "react";
import { MappackTrack, TimeGoal } from "@/types/mappack.types";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { CollapsibleTrackItem } from "./CollapsibleTrackItem";

interface TrackTimesTabProps {
  tracks: MappackTrack[];
  timeGoals: TimeGoal[];
  timeInputValues: Record<string, Record<number, string>>;
  onUpdateTrackTime: (trackId: string, timeGoalId: number, timeString: string) => void;
  onUpdateMapStyle: (trackId: string, mapStyle: string) => void;
  onDeleteTrack: (trackId: string, trackName: string) => void;
  inputClassNames: any;
}

export function TrackTimesTab({
  tracks,
  timeGoals,
  timeInputValues,
  onUpdateTrackTime,
  onUpdateMapStyle,
  onDeleteTrack,
  inputClassNames,
}: TrackTimesTabProps) {
  // Initialize time input values from existing data
  useEffect(() => {
    tracks.forEach((track) => {
      track.timeGoalMappackTrack?.forEach((tgmt) => {
        if (tgmt.time && !timeInputValues[track.track_id]?.[tgmt.time_goal_id]) {
          const timeString = millisecondsToTimeString(tgmt.time);
          onUpdateTrackTime(track.track_id, tgmt.time_goal_id, timeString);
        }
      });
    });
  }, [tracks]); // Only run when tracks change

  const timeGoalIds = timeGoals.filter((tg) => tg.id).map((tg) => tg.id!);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[auto_1fr] items-center gap-2 mb-4">
        <p className="text-xl font-ruigslay">Track Time Goals</p>
        <div className="flex-1 h-[5px] bg-neutral-300"></div>
      </div>

      {tracks.length === 0 && (
        <p className="text-gray-400 italic text-center py-8">
          No tracks in this mappack.
        </p>
      )}

      <div className="space-y-3">
        {tracks.map((track) => (
          <CollapsibleTrackItem
            key={track.track_id}
            track={track}
            timeGoals={timeGoals}
            timeInputValues={timeInputValues}
            onTimeGoalChange={onUpdateTrackTime}
            onMapStyleChange={onUpdateMapStyle}
            onDelete={onDeleteTrack}
            inputClassNames={inputClassNames}
          />
        ))}
      </div>
    </div>
  );
}