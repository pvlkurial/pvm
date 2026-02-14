import { MappackTrack, TimeGoal } from "@/types/mappack.types";

export function calculateTrackPoints(
  track: MappackTrack,
  timeGoals: TimeGoal[]
): number {
  if (!track.tier) return 0;

  const achievedGoals = track.timeGoalMappackTrack?.filter(
    (tg) => tg.is_achieved
  ) || [];
  
  if (achievedGoals.length === 0) return 0;
  const bestGoal = achievedGoals.reduce((best, current) => {
    const currentGoal = timeGoals.find((tg) => tg.id === current.time_goal_id);
    const bestGoal = timeGoals.find((tg) => tg.id === best.time_goal_id);
    
    if (!currentGoal) return best;
    if (!bestGoal) return current;
    
    return currentGoal.multiplier > bestGoal.multiplier ? current : best;
  });

  const timeGoal = timeGoals.find((tg) => tg.id === bestGoal.time_goal_id);
  if (!timeGoal) return 0;

  return timeGoal.multiplier * track.tier.points;
}

export function getBestAchievedGoal(
  track: MappackTrack,
  timeGoals: TimeGoal[]
): TimeGoal | null {
  const achievedGoals = track.timeGoalMappackTrack?.filter(
    (tg) => tg.is_achieved
  ) || [];
  
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

export function formatTimeDelta(
  playerTime: number,
  loggedInTime: number
): { formatted: string; color: string } {
  const delta = playerTime - loggedInTime;

  const absDelta = Math.abs(delta);
  const totalSeconds = Math.floor(absDelta / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = absDelta % 1000;
  
  const sign = delta > 0 ? '-' : '+';
  const color = delta > 0 ? 'text-blue-400' : 'text-red-400';
  const formatted = `${sign}${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
  
  return { formatted, color };
}

export function formatPointsDelta(
  selectedPoints: number,
  loggedInPoints: number
): { formatted: string; color: string } | null {
  if (selectedPoints === 0 && loggedInPoints === 0) {
    return null;
  }

  const delta = loggedInPoints - selectedPoints;
  const sign = delta > 0 ? '+' : '';
  const color = delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : 'text-white/30';
  const formatted = delta !== 0 ? `${sign}${delta}` : '0';
  
  return { formatted, color };
}

/**
 * Calculate completion statistics for a mappack
 */
export function calculateCompletionStats(tracks: MappackTrack[]): {
  current: number;
  total: number;
  percentage: number;
} {
  const current = tracks.reduce((total, track) => {
    const achievedCount =
      track.timeGoalMappackTrack?.filter((tg) => tg.is_achieved).length || 0;
    return total + achievedCount;
  }, 0);

  const total = tracks.reduce((total, track) => {
    return total + (track.timeGoalMappackTrack?.length || 0);
  }, 0);

  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return { current, total, percentage };
}