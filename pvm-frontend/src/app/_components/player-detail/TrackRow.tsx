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
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
        <Image
          src={track.track.thumbnailUrl}
          alt={track.track.name}
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <FormattedText
          text={track.track.name}
          className="text-white font-semibold truncate block"
        />
      </div>

      <div className="text-center min-w-[100px]">
        <p className="text-xs text-white/50 uppercase">Goal</p>
        <p className="text-sm font-semibold text-white">
          {bestGoal ? bestGoal.name : "-"}
        </p>
      </div>

      <div className="text-center min-w-[120px]">
        <p className="text-xs text-white/50 uppercase">Time</p>
        <p className="text-sm font-mono text-white">
          {playerTime ? millisecondsToTimeString(playerTime) : "-"}
        </p>
      </div>

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

      <div className="text-center min-w-[80px]">
        <p className="text-xs text-white/50 uppercase">Points</p>
        <p className="text-sm font-bold text-green-400">
          {points > 0 ? points : "-"}
        </p>
      </div>

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
  );
}