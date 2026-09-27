import { MappackTrack, TimeGoal } from "@/types/mappack.types";
import { formatSignedDuration } from "./time.utils";

/** The highest-multiplier goal the player has achieved on this track. */
export function getBestAchievedGoal(
  track: MappackTrack,
  timeGoals: TimeGoal[],
): TimeGoal | null {
  const achievedGoals =
    track.timeGoalMappackTrack?.filter((tg) => tg.is_achieved) || [];

  if (achievedGoals.length === 0) return null;

  const bestGoal = achievedGoals.reduce((best, current) => {
    const currentGoal = timeGoals.find((tg) => tg.id === current.time_goal_id);
    const bestGoal = timeGoals.find((tg) => tg.id === best.time_goal_id);

    if (!currentGoal) return best;
    if (!bestGoal) return current;

    return currentGoal.multiplier > bestGoal.multiplier ? current : best;
  });

  return timeGoals.find((tg) => tg.id === bestGoal.time_goal_id) || null;
}

export function calculateTrackPoints(
  track: MappackTrack,
  timeGoals: TimeGoal[],
): number {
  if (!track.tier) return 0;
  const bestGoal = getBestAchievedGoal(track, timeGoals);
  return bestGoal ? bestGoal.multiplier * track.tier.points : 0;
}

export function calculateMaxTrackPoints(
  track: MappackTrack,
  timeGoals: TimeGoal[],
): number {
  if (!track.tier) return 0;

  const maxMultiplier = (track.timeGoalMappackTrack || []).reduce(
    (max, tgmt) => {
      const timeGoal = timeGoals.find((tg) => tg.id === tgmt.time_goal_id);
      return timeGoal && timeGoal.multiplier > max ? timeGoal.multiplier : max;
    },
    0,
  );

  return maxMultiplier * track.tier.points;
}

/**
 * The track's goals with their names and multipliers filled in from the
 * mappack's definitions, easiest first.
 */
export function enrichTrackTimeGoals(
  track: MappackTrack,
  timeGoals: TimeGoal[],
) {
  return track.timeGoalMappackTrack
    .map((tgmt) => {
      const definition = timeGoals.find((def) => def.id === tgmt.time_goal_id);
      return {
        ...tgmt,
        name: definition?.name || `Goal ${tgmt.time_goal_id}`,
        multiplier: definition?.multiplier || 0,
      };
    })
    .sort((a, b) => a.multiplier - b.multiplier);
}

export type EnrichedTimeGoal = ReturnType<typeof enrichTrackTimeGoals>[number];

/** How the viewed player's time compares with the signed-in player's. */
export function formatTimeDelta(
  playerTime: number,
  loggedInTime: number,
): { formatted: string; color: string } {
  const delta = playerTime - loggedInTime;
  const isAhead = delta > 0;

  return {
    formatted: formatSignedDuration(delta, isAhead ? "-" : "+"),
    color: isAhead ? "text-blue-400" : "text-red-400",
  };
}

export function formatPointsDelta(
  selectedPoints: number,
  loggedInPoints: number,
): { formatted: string; color: string } | null {
  if (selectedPoints === 0 && loggedInPoints === 0) {
    return null;
  }

  const delta = loggedInPoints - selectedPoints;
  const sign = delta > 0 ? "+" : "";
  const color =
    delta > 0 ? "text-green-400" : delta < 0 ? "text-red-400" : "text-faint";
  const formatted = delta !== 0 ? `${sign}${delta}` : "0";

  return { formatted, color };
}

/** Achieved time goals out of all time goals, across every track. */
export function calculateCompletionStats(tracks: MappackTrack[]): {
  current: number;
  total: number;
} {
  return tracks.reduce(
    (stats, track) => {
      const goals = track.timeGoalMappackTrack ?? [];
      return {
        current: stats.current + goals.filter((tg) => tg.is_achieved).length,
        total: stats.total + goals.length,
      };
    },
    { current: 0, total: 0 },
  );
}
