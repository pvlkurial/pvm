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
