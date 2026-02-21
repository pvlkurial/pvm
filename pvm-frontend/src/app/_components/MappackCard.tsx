import React from "react";
import Link from "next/link";
import { Mappack } from "@/types/mappack.types";
import MapStyleIcon from "./MapStyleIcon";

interface Props {
  mappack: Mappack;
  width: number;
  isClone?: boolean;
  isDragging: React.MutableRefObject<boolean>;
}

export default function MappackCard({ mappack, width, isClone, isDragging }: Props) {
  return (
    <Link
      href={`/mappacks/${mappack.id}`}
      className="mp-card"
      style={{ width }}
      tabIndex={isClone ? -1 : 0}
      draggable={false}
      onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
    >
      <div className="mp-inner">
        <div
          className="mp-img"
          style={{ backgroundImage: `url(${mappack.thumbnailURL})` }}
        />
        <div className="mp-grad" />
        <div className="mp-accent" />
        {(mappack as Mappack & { mapStyleName?: string }).mapStyleName && (
          <MapStyleIcon
            styleKey={(mappack as Mappack & { mapStyleName?: string }).mapStyleName!}
            className="mp-style-icon"
          />
        )}
        <div className="mp-text">
          <p className="mp-name">{mappack.name}</p>
          {mappack.MappackTrack?.length > 0 && (
            <p className="mp-count">{mappack.MappackTrack.length} tracks</p>
          )}
        </div>
      </div>
    </Link>
  );
}