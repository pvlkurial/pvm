import { MappackTrack } from "@/types/mappack.types";

/** Tracks on which the given time goal has not been achieved yet. */
export function filterTracksByTimeGoal(
  tracks: MappackTrack[],
  timeGoalId: number | null,
): MappackTrack[] {
  if (timeGoalId === null) {
    return tracks;
  }

  return tracks.filter((track) => {
    const timeGoalStatus = track.timeGoalMappackTrack?.find(
      (tg) => tg.time_goal_id === timeGoalId,
    );
    return timeGoalStatus?.is_achieved !== true;
  });
}

export function getNotAchievedCount(
  tracks: MappackTrack[],
  timeGoalId: number,
): number {
  return filterTracksByTimeGoal(tracks, timeGoalId).length;
}
