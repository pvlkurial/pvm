import { useEffect } from "react";
import { MappackTrack, TimeGoal } from "@/types/mappack.types";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { groupTracksByTier, sortTiersByPoints } from "@/utils/mappack.utils";
import { CollapsibleTrackItem } from "./CollapsibleTrackItem";

interface TrackTimesTabProps {
  tracks: MappackTrack[];
  timeGoals: TimeGoal[];
  timeInputValues: Record<string, Record<number, string>>;
  onUpdateTrackTime: (
    trackId: string,
    timeGoalId: number,
    timeString: string,
  ) => void;
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
  useEffect(() => {
    tracks.forEach((track) => {
      track.timeGoalMappackTrack?.forEach((tgmt) => {
        if (
          tgmt.time &&
          !timeInputValues[track.track_id]?.[tgmt.time_goal_id]
        ) {
          const timeString = millisecondsToTimeString(tgmt.time);
          onUpdateTrackTime(track.track_id, tgmt.time_goal_id, timeString);
        }
      });
    });
  }, [tracks]);

  const tracksByTier = groupTracksByTier(tracks);
  const sortedTierKeys = sortTiersByPoints(tracksByTier, "asc");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <p className="text-xl font-ruigslay">Track Time Goals</p>
        <div className="flex-1 h-[5px] bg-neutral-300"></div>
      </div>

      {tracks.length === 0 && (
        <p className="text-gray-400 italic text-center py-8">
          No tracks in this mappack.
        </p>
      )}

      {sortedTierKeys.map((tierKey) => {
        const { tier, tracks: tierTracks } = tracksByTier[tierKey];
        const tierColor = tier?.color ?? "#6b7280";

        return (
          <div key={tierKey} className="space-y-3">
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: tierColor }}
              >
                {tierKey}
              </span>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: tierColor + "44" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 items-start">
              {tierTracks.map((track) => (
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
      })}
    </div>
  );
}
