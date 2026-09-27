import { MappackTrack, Mappack } from "@/types/mappack.types";
import {
  calculateTrackPoints,
  formatPointsDelta,
  formatTimeDelta,
  getBestAchievedGoal,
} from "@/utils/player.utils";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { cn } from "@/lib/utils";
import { FormattedText } from "@/components/common/FormattedText";
import { trackRowColumns } from "./trackRowLayout";

interface TrackRowProps {
  track: MappackTrack;
  playerMappack: Mappack;
  loggedInMappack?: Mappack;
}

const EMPTY = <span className="text-faint">—</span>;

function Thumbnail({ track, className }: { track: MappackTrack; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={track.track.thumbnailUrl}
      alt={track.track.name}
      className={cn("shrink-0 rounded-md object-cover", className)}
    />
  );
}

function MobileStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-1">{label}</p>
      {children}
    </div>
  );
}

export function TrackRow({ track, playerMappack, loggedInMappack }: TrackRowProps) {
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
    playerTime && loggedInTime ? formatTimeDelta(playerTime, loggedInTime) : null;
  const pointsDelta = loggedInMappack
    ? formatPointsDelta(points, loggedInPoints)
    : null;

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-2 p-3 transition-colors hover:bg-surface-3">
      <div className="space-y-3 md:hidden">
        <div className="flex items-center gap-3">
          <Thumbnail track={track} className="size-14" />
          <FormattedText
            text={track.track.name}
            className="block min-w-0 flex-1 text-small leading-tight font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-small">
          <MobileStat label="Goal">
            <p className="font-medium">{bestGoal ? bestGoal.name : "-"}</p>
          </MobileStat>
          <MobileStat label="Time">
            <p className="font-mono">
              {playerTime ? millisecondsToTimeString(playerTime) : "-"}
            </p>
          </MobileStat>
          <MobileStat label="Points">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-400">
                {points > 0 ? points : "-"}
              </span>
              {pointsDelta && (
                <span className={cn("text-xs font-semibold", pointsDelta.color)}>
                  ({pointsDelta.formatted})
                </span>
              )}
            </div>
          </MobileStat>
          {timeDelta && (
            <MobileStat label="Δ Time">
              <p className={cn("font-mono font-semibold", timeDelta.color)}>
                {timeDelta.formatted}
              </p>
            </MobileStat>
          )}
        </div>
      </div>

      {/* Labels live in TrackRowHeader, once per tier, so rows stay scannable. */}
      <div
        className="hidden items-center gap-4 text-small md:grid"
        style={{ gridTemplateColumns: trackRowColumns(!!loggedInMappack) }}
      >
        <Thumbnail track={track} className="size-16" />

        <FormattedText
          text={track.track.name}
          className="block min-w-0 truncate font-medium"
        />

        <p className="truncate text-center font-medium">
          {bestGoal ? bestGoal.name : EMPTY}
        </p>

        <p className="text-center font-mono">
          {playerTime ? millisecondsToTimeString(playerTime) : EMPTY}
        </p>

        {loggedInMappack && (
          <p className={cn("text-center font-mono", timeDelta?.color)}>
            {timeDelta ? timeDelta.formatted : EMPTY}
          </p>
        )}

        <p className={cn("text-center font-semibold", points > 0 && "text-green-400")}>
          {points > 0 ? points : EMPTY}
        </p>

        {loggedInMappack && (
          <p className={cn("text-center font-semibold", pointsDelta?.color)}>
            {pointsDelta ? pointsDelta.formatted : EMPTY}
          </p>
        )}
      </div>
    </div>
  );
}
