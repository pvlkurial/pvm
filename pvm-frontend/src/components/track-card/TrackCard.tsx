"use client";
import { useRouter } from "next/navigation";
import { MappackTrack, TimeGoal } from "@/types/mappack.types";
import { millisecondsToTimeString } from "@/utils/time.utils";
import {
  calculateMaxTrackPoints,
  calculateTrackPoints,
  enrichTrackTimeGoals,
} from "@/utils/player.utils";
import { cn } from "@/lib/utils";
import { FormattedText } from "@/components/common/FormattedText";
import { TrackCardGoals } from "./TrackCardGoals";
import { TrackCardRank } from "./TrackCardRank";
import { TrackCardPlay } from "./TrackCardPlay";

/** Frosted strip laid over the thumbnail so text stays legible on any image. */
const GLASS = "bg-black/40 backdrop-blur-md";

function pointsColor(current: number, max: number): string {
  if (current === 0) return "text-faint";
  if (current === max) return "text-green-400";
  return "text-yellow-400";
}

interface TrackCardProps {
  mappackTrack: MappackTrack;
  timeGoalDefinitions: TimeGoal[];
  mappackId: string;
  alwaysShowDetails?: boolean;
}

export function TrackCard({
  mappackTrack,
  timeGoalDefinitions,
  mappackId,
  alwaysShowDetails = false,
}: TrackCardProps) {
  const router = useRouter();
  const { track, personal_best } = mappackTrack;
  const href = `/mappacks/${mappackId}/${track.id}`;

  const timeGoals = enrichTrackTimeGoals(mappackTrack, timeGoalDefinitions);
  const currentPoints = calculateTrackPoints(mappackTrack, timeGoalDefinitions);
  const maxPoints = calculateMaxTrackPoints(mappackTrack, timeGoalDefinitions);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(href);
      }}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-border bg-surface-1 outline-none transition-transform duration-300 transform-gpu hover:z-20 focus-visible:border-foreground md:hover:scale-105"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={track.thumbnailUrl}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />

      <div className="absolute top-2 left-1/2 z-10 w-auto max-w-[90%] -translate-x-1/2">
        <div className={cn("flex w-full min-w-0 flex-col items-center rounded-2xl px-3 py-1.5", GLASS)}>
          <h4 className="text-center text-xs leading-tight font-medium text-balance sm:text-small">
            <FormattedText text={track.name} />
          </h4>
          <div className="grid w-full grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:grid-rows-[1fr]">
            <p className="min-w-0 overflow-hidden pt-0.5 text-center text-[10px] leading-tight text-muted-foreground sm:text-xs">
              {track.author}
            </p>
          </div>
        </div>
      </div>

      {mappackTrack.track_position && (
        <TrackCardRank position={mappackTrack.track_position} />
      )}
      <TrackCardPlay trackId={track.id} />

      <div
        className={cn(
          "absolute inset-x-0 -bottom-1 z-10 max-h-[55%] overflow-hidden border-t border-white/10 px-3.5 pt-2 pb-1.5 transition-transform duration-300 ease-in-out",
          GLASS,
          alwaysShowDetails ? "translate-y-0" : "translate-y-full group-hover:translate-y-0",
        )}
      >
        <div className="flex items-center justify-between gap-1.5 text-[10px] whitespace-nowrap uppercase text-muted-foreground">
          <span>
            {personal_best
              ? `PB: ${millisecondsToTimeString(personal_best)}`
              : "Not played yet"}
          </span>
          <span>
            Points:{" "}
            <span className={cn("font-semibold", pointsColor(currentPoints, maxPoints))}>
              {currentPoints}/{maxPoints}
            </span>
          </span>
        </div>

        <TrackCardGoals timeGoals={timeGoals} compact={alwaysShowDetails} />
      </div>
    </div>
  );
}
