function pad(value: number, length: number): string {
  return value.toString().padStart(length, "0");
}

/** Formats a duration as M:SS:mmm, the notation Trackmania players read times in. */
function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${pad(seconds, 2)}:${pad(ms % 1000, 3)}`;
}

/** A difference between two times, with an explicit sign in front. */
export function formatSignedDuration(deltaMs: number, sign: "+" | "-"): string {
  return `${sign}${formatDuration(Math.abs(deltaMs))}`;
}

export const millisecondsToTimeString = (ms: number): string => {
  if (!ms) return "";
  return formatDuration(ms);
};

/**
 * Parses a lap time, accepting either separator before the milliseconds:
 * `1:03:942` and `1:03.942` are the same time. A minutes-less form works too,
 * but only with a dot (`43.210`), since `43:210` cannot be told apart from a
 * minutes:seconds time.
 *
 * Fractional digits are read as a decimal fraction of a second and padded on
 * the right, so `1:03.9` is 900ms rather than 9ms, and both separators behave
 * identically. Returns 0 for anything unparseable, matching the previous
 * contract.
 */
const FULL_TIME = /^(\d+):(\d{1,2})[:.](\d{1,3})$/;
/**
 * Seconds and milliseconds only. Requires the dot: "43:210" would be
 * indistinguishable from a minutes:seconds time like "1:03", so a colon here is
 * rejected rather than guessed at.
 */
const SECONDS_ONLY_TIME = /^(\d{1,2})\.(\d{1,3})$/;

export const timeStringToMilliseconds = (timeString: string): number => {
  if (!timeString || timeString.trim() === "") return 0;

  const trimmed = timeString.trim();

  const full = FULL_TIME.exec(trimmed);
  if (full) {
    const [, minutes, seconds, fraction] = full;
    return (
      (parseInt(minutes, 10) || 0) * 60 * 1000 +
      (parseInt(seconds, 10) || 0) * 1000 +
      (parseInt(fraction.padEnd(3, "0"), 10) || 0)
    );
  }

  const short = SECONDS_ONLY_TIME.exec(trimmed);
  if (short) {
    const [, seconds, fraction] = short;
    return (
      (parseInt(seconds, 10) || 0) * 1000 +
      (parseInt(fraction.padEnd(3, "0"), 10) || 0)
    );
  }

  return 0;
};

export function calculateTimeDelta(
  personalBest: number,
  goalTime: number,
): {
  delta: number;
  isAchieved: boolean;
  formatted: string;
} {
  const delta = personalBest - goalTime;
  const isAchieved = delta <= 0;

  return {
    delta,
    isAchieved,
    formatted: formatSignedDuration(delta, isAchieved ? "-" : "+"),
  };
}

export function formatSecondsToMMSS(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${pad(seconds % 60, 2)}`;
}
