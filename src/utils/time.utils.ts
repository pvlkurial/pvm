export const millisecondsToTimeString = (ms: number): string => {
  if (!ms || ms === 0) return "";

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  return `${minutes}:${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
};

export const timeStringToMilliseconds = (timeString: string): number => {
  if (!timeString || timeString.trim() === "") return 0;

  try {
    const parts = timeString.split(":");
    if (parts.length !== 3) return 0;

    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    const milliseconds = parseInt(parts[2]) || 0;

    return minutes * 60 * 1000 + seconds * 1000 + milliseconds;
  } catch (error) {
    console.error("Error parsing time string:", timeString, error);
    return 0;
  }
};

export function calculateTimeDelta(personalBest: number, goalTime: number): {
  delta: number;
  isAchieved: boolean;
  formatted: string;
} {
  const delta = personalBest - goalTime;
  const isAchieved = delta <= 0;
  
  const absDelta = Math.abs(delta);
  const totalSeconds = Math.floor(absDelta / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = absDelta % 1000;
  
  const sign = isAchieved ? '-' : '+';
  const formatted = `${sign}${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
  
  return {
    delta,
    isAchieved,
    formatted,
  };
}

export function formatSecondsToMMSS(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}