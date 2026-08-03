import React from "react";
import Link from "next/link";
import { Mappack } from "@/types/mappack.types";
import MapStyleIcon from "./MapStyleIcon";

interface Props {
  mappack: Mappack;
}

export default function MappackCard({ mappack }: Props) {
  return (
    <Link
      href={`/mappacks/${mappack.id}`}
      className="mp-card"
      // Set on the card so both the hover bar and the NEW tag inherit it.
      style={
        mappack.accentColor
          ? ({ "--mp-accent": mappack.accentColor } as React.CSSProperties)
          : undefined
      }
      draggable={false}
    >
      <div className="mp-inner">
        <div
          className="mp-img"
          style={{ backgroundImage: `url(${mappack.thumbnailURL})` }}
        />
        <div className="mp-grad" />
        <div className="mp-accent" />
        {mappack.mapStyleName && (
          <MapStyleIcon
            styleKey={mappack.mapStyleName}
            className="mp-style-icon"
          />
        )}
        <div className="mp-text">
          <p className="mp-name">
            {mappack.name}
            {mappack.isNew && <span className="mp-new">New</span>}
          </p>
          {mappack.MappackTrack?.length > 0 && (
            <p className="mp-count">{mappack.MappackTrack.length} tracks</p>
          )}
        </div>
      </div>
    </Link>
  );
}
