import { MappackTrack, Mappack } from "@/types/mappack.types";
import {
  calculateTrackPoints,
  formatPointsDelta,
  formatTimeDelta,
  getBestAchievedGoal,
} from "@/utils/player.utils";
import { FormattedText } from "@/utils/textConverter";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { Image } from "@heroui/react";
import { trackRowColumns } from "./trackRowLayout";

interface TrackRowProps {
  track: MappackTrack;
  playerMappack: Mappack;
  loggedInMappack?: Mappack;
}

export function TrackRow({
  track,
  playerMappack,
  loggedInMappack,
}: TrackRowProps) {
  const playerTime = track.timeGoalMappackTrack?.[0]?.player_time;
  const bestGoal = getBestAchievedGoal(track, playerMappack.timeGoals);
  const points = calculateTrackPoints(track, playerMappack.timeGoals);

  const loggedInTrack = loggedInMappack?.MappackTrack.find(
    (t) => t.track_id === track.track_id,
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
      <div className="md:hidden space-y-3">
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

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-white/40 uppercase mb-1">Goal</p>
            <p className="text-white font-semibold">
              {bestGoal ? bestGoal.name : "-"}
            </p>
          </div>

          <div>
            <p className="text-white/40 uppercase mb-1">Time</p>
            <p className="text-white font-mono">
              {playerTime ? millisecondsToTimeString(playerTime) : "-"}
            </p>
          </div>

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

      {/* Labels live in TrackRowHeader, once per tier, so rows stay scannable. */}
      <div
        className="hidden md:grid items-center gap-4"
        style={{ gridTemplateColumns: trackRowColumns(!!loggedInMappack) }}
      >
        <div className="relative w-16 h-16 rounded overflow-hidden">
          <Image
            src={track.track.thumbnailUrl}
            alt={track.track.name}
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <FormattedText
            text={track.track.name}
            className="text-white font-semibold truncate block"
          />
        </div>

        <p className="text-center text-sm font-semibold text-white truncate">
          {bestGoal ? bestGoal.name : <span className="text-white/25">—</span>}
        </p>

        <p className="text-center text-sm font-mono text-white">
          {playerTime ? (
            millisecondsToTimeString(playerTime)
          ) : (
            <span className="text-white/25">—</span>
          )}
        </p>

        {loggedInMappack && (
          <p
            className={`text-center text-sm font-mono ${
              timeDelta ? timeDelta.color : "text-white/25"
            }`}
          >
            {timeDelta ? timeDelta.formatted : "—"}
          </p>
        )}

        <p
          className={`text-center text-sm font-bold ${
            points > 0 ? "text-green-400" : "text-white/25"
          }`}
        >
          {points > 0 ? points : "—"}
        </p>

        {loggedInMappack && (
          <p
            className={`text-center text-sm font-bold ${
              pointsDelta ? pointsDelta.color : "text-white/25"
            }`}
          >
            {pointsDelta ? pointsDelta.formatted : "—"}
          </p>
        )}
      </div>
    </div>
  );
}
