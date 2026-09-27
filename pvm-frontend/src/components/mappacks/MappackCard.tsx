import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { Mappack } from "@/types/mappack.types";
import { Badge } from "@/components/ui/badge";
import { MapStyleIcon } from "@/components/common/MapStyleIcon";
import { MappackLinks } from "@/components/common/MappackLinks";

/** Hover effects wait a moment before starting, then ease in slowly. */
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
      className="absolute inset-0 flex items-end p-6"
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
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-1 transition-[transform,border-color] hover:z-10 hover:scale-[1.03] hover:border-muted-foreground/40 hover:delay-150 has-[a:focus-visible]:border-foreground ${HOVER_EASE}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {mappack.thumbnailURL ? (
          <>
            <div
              className={`absolute inset-0 bg-cover bg-center brightness-[0.8] transition-[filter] group-hover:brightness-100 group-hover:delay-150 ${HOVER_EASE}`}
              style={{ backgroundImage: `url(${mappack.thumbnailURL})` }}
            />
            {mappack.mapStyleName && (
              <MapStyleIcon
                styleKey={mappack.mapStyleName}
                size={44}
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
      </div>

      <div className="h-1.5 shrink-0" style={{ backgroundColor: accentColor }} />

      <div className="flex flex-1 flex-col gap-5 p-6">
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
          <p className="mt-2 text-body text-muted-foreground">{mappack.organization}</p>
        )}
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-border-subtle pt-4">
          {/* Raised above the stretched link so the buttons stay clickable. */}
          <MappackLinks mappack={mappack} variant="labelled" className="relative z-10" />
          <span
            aria-hidden
            className={`ml-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-0.5 ${HOVER_EASE}`}
          >
            <LuArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
