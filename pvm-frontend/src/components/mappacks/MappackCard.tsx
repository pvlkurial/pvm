import Link from "next/link";
import { Mappack } from "@/types/mappack.types";
import { Badge } from "@/components/ui/badge";
import { MapStyleIcon } from "@/components/common/MapStyleIcon";
import { MappackLinks } from "@/components/common/MappackLinks";

/**
 * Hover effects wait a moment, then ease in. Tailwind's scale-* utilities set
 * the `scale` property rather than `transform`, so that is what transitions.
 */
const HOVER_EASE =
  "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

/** Stands in for a missing thumbnail: the accent colour, a dot grid and the style icon. */
function ThumbnailPlaceholder({
  accentColor,
  styleName,
}: {
  accentColor: string;
  styleName?: string;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pb-16"
      style={{
        backgroundColor: `color-mix(in srgb, ${accentColor} 18%, var(--surface-2))`,
        backgroundImage: "radial-gradient(var(--dot) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
      }}
    >
      {styleName && <MapStyleIcon styleKey={styleName} size={64} className="opacity-80" />}
    </div>
  );
}

export function MappackCard({ mappack }: { mappack: Mappack }) {
  const accentColor = mappack.accentColor || "var(--pack-neutral)";

  return (
    <div
      className={`group relative aspect-[16/11] overflow-hidden rounded-2xl border border-border bg-surface-1 transition-[scale,border-color] hover:z-10 hover:scale-[1.03] hover:border-muted-foreground/40 hover:delay-150 has-[a:focus-visible]:border-foreground ${HOVER_EASE}`}
    >
      {mappack.thumbnailURL ? (
        <>
          <div
            className={`absolute inset-0 bg-cover bg-center brightness-[0.8] transition-[filter] group-hover:brightness-100 group-hover:delay-150 ${HOVER_EASE}`}
            style={{ backgroundImage: `url(${mappack.thumbnailURL})` }}
          />
          {mappack.mapStyleName && (
            <MapStyleIcon
              styleKey={mappack.mapStyleName}
              size={40}
              className="absolute top-3.5 right-3.5 opacity-50"
            />
          )}
        </>
      ) : (
        <ThumbnailPlaceholder accentColor={accentColor} styleName={mappack.mapStyleName} />
      )}

      {mappack.isNew && (
        <Badge variant="inverse" className="absolute top-3.5 left-3.5">
          New
        </Badge>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 border-t border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-2xl leading-tight">
            {/* Stretched over the whole card, so the card itself is the link. */}
            <Link
              href={`/mappacks/${mappack.id}`}
              draggable={false}
              className="outline-none after:absolute after:inset-0"
            >
              {mappack.name}
            </Link>
          </h3>
          {mappack.organization && (
            <p className="truncate text-small text-muted-foreground">{mappack.organization}</p>
          )}
        </div>
        {/* Raised above the stretched link so the buttons stay clickable. */}
        <MappackLinks mappack={mappack} size="icon-sm" className="relative z-10 shrink-0 flex-nowrap" />
      </div>
    </div>
  );
}
