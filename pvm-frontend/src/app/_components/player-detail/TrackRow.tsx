import { MappackTrack, Mappack } from "@/types/mappack.types";
import { calculateTrackPoints, formatPointsDelta, formatTimeDelta, getBestAchievedGoal } from "@/utils/player.utils";
import { FormattedText } from "@/utils/textConverter";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { Image } from "@heroui/react";

interface TrackRowProps {
  track: MappackTrack;
  playerMappack: Mappack;
  loggedInMappack?: Mappack;
}

export function TrackRow({ track, playerMappack, loggedInMappack }: TrackRowProps) {
  const playerTime = track.timeGoalMappackTrack?.[0]?.player_time;
  const bestGoal = getBestAchievedGoal(track, playerMappack.timeGoals);
  const points = calculateTrackPoints(track, playerMappack.timeGoals);

  const loggedInTrack = loggedInMappack?.MappackTrack.find(
    (t) => t.track_id === track.track_id
  );
  const loggedInTime = loggedInTrack?.timeGoalMappackTrack?.[0]?.player_time;
  const loggedInPoints = loggedInTrack
    ? calculateTrackPoints(loggedInTrack, loggedInMappack!.timeGoals)
    : 0;

  const timeDelta =
    playerTime && loggedInTime
      ? formatTimeDelta(playerTime, loggedInTime)
      : null;
  
  const pointsDelta = loggedInMappack
    ? formatPointsDelta(points, loggedInPoints)
    : null;

  return (
    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      {/* Mobile Layout (< MD) */}
      <div className="md:hidden space-y-3">
        {/* Top Row: Thumbnail + Name */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src={track.track.thumbnailUrl}
              alt={track.track.name}
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <FormattedText
              text={track.track.name}
              className="text-white font-semibold text-sm leading-tight block"
            />
          </div>
        </div>

        {/* Bottom Row: Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Goal */}
          <div>
            <p className="text-white/40 uppercase mb-1">Goal</p>
            <p className="text-white font-semibold">
              {bestGoal ? bestGoal.name : "-"}
            </p>
          </div>

          {/* Time */}
          <div>
            <p className="text-white/40 uppercase mb-1">Time</p>
            <p className="text-white font-mono">
              {playerTime ? millisecondsToTimeString(playerTime) : "-"}
            </p>
          </div>

          {/* Points */}
          <div>
            <p className="text-white/40 uppercase mb-1">Points</p>
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-bold">
                {points > 0 ? points : "-"}
              </span>
              {loggedInMappack && pointsDelta && (
                <span className={`text-xs font-semibold ${pointsDelta.color}`}>
                  ({pointsDelta.formatted})
                </span>
              )}
            </div>
          </div>

          {/* Time Delta (only show if logged in and has delta) */}
          {loggedInMappack && timeDelta && (
            <div>
              <p className="text-white/40 uppercase mb-1">Δ Time</p>
              <p className={`font-mono font-semibold ${timeDelta.color}`}>
                {timeDelta.formatted}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout (>= MD) */}
      <div className="hidden md:flex items-center gap-4">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
          <Image
            src={track.track.thumbnailUrl}
            alt={track.track.name}
            className="object-cover"
          />
        </div>

        {/* Track Name */}
        <div className="flex-1 min-w-0">
          <FormattedText
            text={track.track.name}
            className="text-white font-semibold truncate block"
          />
        </div>

        {/* Achieved Goal */}
        <div className="text-center min-w-[100px]">
          <p className="text-xs text-white/50 uppercase">Goal</p>
          <p className="text-sm font-semibold text-white">
            {bestGoal ? bestGoal.name : "-"}
          </p>
        </div>

        {/* Player Time */}
        <div className="text-center min-w-[120px]">
          <p className="text-xs text-white/50 uppercase">Time</p>
          <p className="text-sm font-mono text-white">
            {playerTime ? millisecondsToTimeString(playerTime) : "-"}
          </p>
        </div>

        {/* Time Delta */}
        {loggedInMappack && (
          <div className="text-center min-w-[120px]">
            <p className="text-xs text-white/50 uppercase">Δ Time</p>
            <p
              className={`text-sm font-mono ${
                timeDelta ? timeDelta.color : "text-white/30"
              }`}
            >
              {timeDelta ? timeDelta.formatted : "-"}
            </p>
          </div>
        )}

        {/* Points */}
        <div className="text-center min-w-[80px]">
          <p className="text-xs text-white/50 uppercase">Points</p>
          <p className="text-sm font-bold text-green-400">
            {points > 0 ? points : "-"}
          </p>
        </div>

        {/* Points Delta */}
        {loggedInMappack && (
          <div className="text-center min-w-[80px]">
            <p className="text-xs text-white/50 uppercase">Δ Pts</p>
            <p
              className={`text-sm font-bold ${
                pointsDelta ? pointsDelta.color : "text-white/30"
              }`}
            >
              {pointsDelta ? pointsDelta.formatted : "-"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}