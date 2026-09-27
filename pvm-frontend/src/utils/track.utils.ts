import { Track } from "@/types/mappack.types";

/** The track's time goals, easiest first, with the world record appended as a final goal. */
export function getGoalsWithWorldRecord(track: Track) {
  const goals = [...(track.timegoals ?? [])].sort(
    (a, b) => a.multiplier - b.multiplier,
  );

  const worldRecord = track.records?.length
    ? track.records.reduce((best, r) => (r.score < best.score ? r : best))
    : null;

  return worldRecord
    ? [...goals, { name: "WR", time: worldRecord.score, multiplier: Infinity }]
    : goals;
}

/** The goal named `goalName` on this track, or its easiest goal if there is none. */
export function findGoalByName(track: Track, goalName?: string) {
  const goals = getGoalsWithWorldRecord(track);
  return goals.find((goal) => goal.name === goalName) ?? goals[0];
}
