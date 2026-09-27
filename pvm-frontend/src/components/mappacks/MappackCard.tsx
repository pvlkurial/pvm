import Link from "next/link";
import { Mappack } from "@/types/mappack.types";
import { Badge } from "@/components/ui/badge";
import { MappackLinks } from "@/components/common/MappackLinks";
import {
  MapStyleIcon,
  getMapStyleLabel,
} from "@/components/common/MapStyleIcon";

/** Hover effects wait a moment before starting, then ease in slowly. */
const HOVER_EASE =
  "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:delay-150 motion-reduce:transition-none";

/** Stands in for a missing thumbnail: a dot grid with the style name. */
function ThumbnailPlaceholder({ styleName }: { styleName?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface-2 bg-[radial-gradient(var(--dot)_1px,transparent_1px)] bg-size-[14px_14px]">
      {styleName && (
        <span className="font-display text-display-m text-muted-foreground italic">
          {getMapStyleLabel(styleName)}
        </span>
      )}
    </div>
  );
}

export function MappackCard({ mappack }: { mappack: Mappack }) {
  const trackCount = mappack.MappackTrack?.length ?? 0;
  const accentColor = mappack.accentColor || "var(--pack-neutral)";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface-1 transition-colors duration-300 hover:border-muted-foreground/40 hover:delay-150 has-[a:focus-visible]:border-foreground">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border-subtle">
        {mappack.thumbnailURL ? (
          <div
            className={`absolute inset-0 bg-cover bg-center brightness-[0.8] transition-[filter,transform] group-hover:scale-105 group-hover:brightness-100 ${HOVER_EASE}`}
            style={{ backgroundImage: `url(${mappack.thumbnailURL})` }}
          />
        ) : (
          <ThumbnailPlaceholder styleName={mappack.mapStyleName} />
        )}

        {mappack.mapStyleName && (
          <MapStyleIcon
            styleKey={mappack.mapStyleName}
            size={44}
            className={`absolute top-3.5 right-3.5 opacity-40 transition-opacity group-hover:opacity-70 ${HOVER_EASE}`}
          />
        )}

        {/* Sweeps across the bottom on hover, in the mappack's accent colour. */}
        <div
          className={`absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform group-hover:scale-x-100 ${HOVER_EASE}`}
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-title text-balance">
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
            <p className="mt-1.5 text-small text-muted-foreground">
              {mappack.organization}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2">
          {trackCount > 0 && (
            <span className="text-caption tabular-nums text-faint">{trackCount} tracks</span>
          )}
          {/* Raised above the stretched link so the buttons stay clickable. */}
          <MappackLinks mappack={mappack} size="icon-sm" className="relative z-10" />
          {mappack.isNew && (
            <Badge variant="inverse" className="ml-auto">
              New
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
