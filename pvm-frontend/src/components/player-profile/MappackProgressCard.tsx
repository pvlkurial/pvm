import Link from "next/link";
import { PlayerMappackProgress } from "@/types/player.types";
import { getRankProgress } from "@/utils/mappack.utils";
import { ProgressBar } from "@/components/common/ProgressBar";
import { MapStyleIcon } from "@/components/common/MapStyleIcon";

function Thumbnail({ progress }: { progress: PlayerMappackProgress }) {
  const accentColor = progress.accent_color || "var(--pack-neutral)";

  return (
    <div
      className="relative z-10 flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-cover bg-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] sm:size-32"
      style={
        progress.thumbnail_url
          ? { backgroundImage: `url(${progress.thumbnail_url})` }
          : { backgroundColor: `color-mix(in srgb, ${accentColor} 18%, var(--surface-2))` }
      }
    >
      {!progress.thumbnail_url && progress.map_style_name && (
        <MapStyleIcon styleKey={progress.map_style_name} size={32} className="opacity-80" />
      )}
    </div>
  );
}

/**
 * The player's points, leaderboard position, rank and completion in one
 * mappack, laid out like the OBS overlay: a square thumbnail in front of a
 * shorter info panel.
 */
export function MappackProgressCard({ progress }: { progress: PlayerMappackProgress }) {
  const { current } = getRankProgress(progress.total_points, progress.ranks);

  return (
    <Link href={`/mappacks/${progress.mappack_id}`} className="group flex items-center outline-none">
      <Thumbnail progress={progress} />

      <div className="-ml-2.5 flex min-w-0 flex-1 flex-col gap-1.5 rounded-r-[10px] border border-white/10 bg-surface-1 py-2.5 pr-4 pl-6 transition-colors group-hover:border-white/25 group-focus-visible:border-foreground">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="min-w-0 truncate font-display text-xl leading-tight sm:text-2xl">
            {progress.mappack_name}
          </h3>
          <p className="shrink-0 font-display text-xl leading-none tabular-nums sm:text-2xl">
            {progress.total_points.toLocaleString()}
            <span className="ml-1 text-small text-muted-foreground sm:ml-1.5 sm:text-body">Pts</span>
          </p>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <p className="min-w-0 truncate text-body font-semibold tabular-nums sm:text-body-l">
            #{progress.rank}
            {current && (
              <span className="ml-2 sm:ml-3" style={{ color: current.color }}>
                {current.name}
              </span>
            )}
          </p>
          <p className="shrink-0 text-small tabular-nums text-muted-foreground">
            {progress.achieved_goals}/{progress.total_goals}
          </p>
        </div>

        <ProgressBar
          current={progress.achieved_goals}
          total={progress.total_goals}
          color="var(--color-green-500)"
        />
      </div>
    </Link>
  );
}
