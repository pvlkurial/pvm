import { MappackTrack, TimeGoal } from '@/types/mappack.types';

export function filterTracksByTimeGoal(
  tracks: MappackTrack[],
  timeGoalId: number | null
): MappackTrack[] {
  if (timeGoalId === null) {
    return tracks;
  }

  return tracks.filter((track) => {
    const timeGoalStatus = track.timeGoalMappackTrack?.find(
      (tg) => tg.time_goal_id === timeGoalId
    );
    return timeGoalStatus?.is_achieved !== true;
  });
}

export function getNotAchievedCount(
  tracks: MappackTrack[],
  timeGoalId: number
): number {
  return tracks.filter((track) => {
    const goals = track.timeGoalMappackTrack ?? [];
    const tg = goals.find((t) => t.time_goal_id === timeGoalId);
    return !tg || tg.is_achieved !== true;
  }).length;
}