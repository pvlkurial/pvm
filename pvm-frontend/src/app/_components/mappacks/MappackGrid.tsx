"use client";
import React from "react";
import { Mappack } from "@/types/mappack.types";
import MappackCard from "@/app/_components/MappackCard";
import AddMappackCard from "@/app/_components/add-edit-buttons/AddMappackCard";

interface MappackGridProps {
  mappacks: Mappack[];
  /** Appends the create card at the end of the grid. */
  showAddCard?: boolean;
  isLoading: boolean;
  emptyMessage: string;
}

export function MappackGrid({
  mappacks,
  showAddCard = false,
  isLoading,
  emptyMessage,
}: MappackGridProps) {
  const isEmpty = mappacks.length === 0 && !showAddCard;

  if (isEmpty) {
    return (
      <section className="mp-section">
        <div className="mp-empty">{isLoading ? "loading..." : emptyMessage}</div>
      </section>
    );
  }

  return (
    <section className="mp-section">
      <div className="mp-grid">
        {mappacks.map((mappack) => (
          <MappackCard key={mappack.id} mappack={mappack} />
        ))}
        {showAddCard && <AddMappackCard />}
      </div>
    </section>
  );
}
