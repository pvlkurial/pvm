interface TimeGoal {
  name: string;
  time: number;
}

export function getBestAchievedTimeGoal(
  recordTime: number,
  timeGoals: TimeGoal[]
): string | null {
  const sortedGoals = [...timeGoals].sort((a, b) => a.time - b.time);
  
  for (const goal of sortedGoals) {
    if (recordTime <= goal.time) {
      return goal.name;
    }
  }
  
  return null;
}