import { useEffect } from "react";
import { MappackTrack, TimeGoal } from "@/types/mappack.types";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { groupTracksByTier, sortTiersByPoints } from "@/utils/mappack.utils";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CollapsibleTrackItem } from "./CollapsibleTrackItem";

interface TrackTimesTabProps {
  tracks: MappackTrack[];
  timeGoals: TimeGoal[];
  timeInputValues: Record<string, Record<number, string>>;
  onUpdateTrackTime: (trackId: string, timeGoalId: number, timeString: string) => void;
  onUpdateMapStyle: (trackId: string, mapStyle: string) => void;
  onDeleteTrack: (trackId: string, trackName: string) => void;
  onUpdateOrderPosition: (trackId: string, value: number) => void;
  onUpdateTmxId: (trackId: string, value: string) => void;
}

export function TrackTimesTab({
  tracks,
  timeGoals,
  timeInputValues,
  onUpdateTrackTime,
  onUpdateMapStyle,
  onDeleteTrack,
  onUpdateOrderPosition,
  onUpdateTmxId,
}: TrackTimesTabProps) {
  // Seed the text inputs with the saved times, without overwriting anything
  // already typed.
  useEffect(() => {
    tracks.forEach((track) => {
      track.timeGoalMappackTrack?.forEach((tgmt) => {
        if (tgmt.time && !timeInputValues[track.track_id]?.[tgmt.time_goal_id]) {
          onUpdateTrackTime(
            track.track_id,
            tgmt.time_goal_id,
            millisecondsToTimeString(tgmt.time),
          );
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks]);

  const tracksByTier = groupTracksByTier(tracks);
  const sortedTierKeys = sortTiersByPoints(tracksByTier, "asc");

  return (
    <div className="space-y-8">
      <SectionHeading>Track Time Goals</SectionHeading>

      {tracks.length === 0 && (
        <p className="py-8 text-center text-small text-muted-foreground italic">
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
                className="font-mono text-label uppercase"
                style={{ color: tierColor }}
              >
                {tierKey}
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: `${tierColor}44` }} />
            </div>

            <div className="grid items-start gap-3 md:grid-cols-2">
              {tierTracks.map((track) => (
                <CollapsibleTrackItem
                  key={track.track_id}
                  track={track}
                  timeGoals={timeGoals}
                  timeInputValues={timeInputValues}
                  onTimeGoalChange={onUpdateTrackTime}
                  onMapStyleChange={onUpdateMapStyle}
                  onOrderPositionChange={onUpdateOrderPosition}
                  onTmxIdChange={onUpdateTmxId}
                  onDelete={onDeleteTrack}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
