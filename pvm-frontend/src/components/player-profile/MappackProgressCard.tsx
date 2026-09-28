import Link from "next/link";
import { PlayerMappackProgress } from "@/types/player.types";
import { getRankProgress } from "@/utils/mappack.utils";
import { CompletionBar } from "@/components/common/CompletionBar";
import { MapStyleIcon } from "@/components/common/MapStyleIcon";

function Thumbnail({ progress, accentColor }: { progress: PlayerMappackProgress; accentColor: string }) {
  if (progress.thumbnail_url) {
    return (
      <div
        className="aspect-[16/11] w-20 shrink-0 rounded-xl bg-cover bg-center brightness-[0.8] transition-[filter] duration-300 group-hover:brightness-100 sm:w-32"
        style={{ backgroundImage: `url(${progress.thumbnail_url})` }}
      />
    );
  }

  return (
    <div
      className="flex aspect-[16/11] w-20 shrink-0 items-center justify-center rounded-xl sm:w-32"
      style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 18%, var(--surface-2))` }}
    >
      {progress.map_style_name && (
        <MapStyleIcon styleKey={progress.map_style_name} size={32} className="opacity-80" />
      )}
    </div>
  );
}

/** The player's points, leaderboard position, rank and completion in one mappack. */
export function MappackProgressCard({ progress }: { progress: PlayerMappackProgress }) {
  const accentColor = progress.accent_color || "var(--pack-neutral)";
  const { current } = getRankProgress(progress.total_points, progress.ranks);

  return (
    <Link
      href={`/mappacks/${progress.mappack_id}`}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-surface-1 p-3 outline-none transition-colors hover:border-muted-foreground/40 focus-visible:border-foreground"
    >
      <Thumbnail progress={progress} accentColor={accentColor} />

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 pr-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="min-w-0 truncate font-display text-2xl leading-tight">{progress.mappack_name}</h3>
          <p className="shrink-0 font-display text-2xl leading-none tabular-nums">
            {progress.total_points.toLocaleString()}
            <span className="ml-1.5 text-body text-muted-foreground">Pts</span>
          </p>
        </div>

        <p className="text-body-l font-semibold tabular-nums">
          #{progress.rank}
          {current && (
            <span className="ml-3" style={{ color: current.color }}>{current.name}</span>
          )}
        </p>

        <CompletionBar current={progress.achieved_goals} total={progress.total_goals} />
      </div>
    </Link>
  );
}
