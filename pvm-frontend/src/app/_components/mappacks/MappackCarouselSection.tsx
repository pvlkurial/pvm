"use client";
import React, { useState } from "react";
import { Mappack } from "@/types/mappack.types";
import { useCarousel, CarouselItem } from "@/hooks/useCarousel";
import MappackCard from "@/app/_components/MappackCard";
import AddMappackCard from "@/app/_components/add-edit-buttons/AddMappackCard";
import CarouselArrow from "@/app/_components/CarouselArrow";
import CarouselDots from "@/app/_components/CarouselDots";

/** The skew applied to every card; the track is padded by the matching offset. */
const SKEW_RADIANS = (10 * Math.PI) / 180;

type Item =
  | { kind: "mappack"; data: Mappack; id: string }
  | { kind: "add"; id: string };

interface MappackCarouselSectionProps {
  mappacks: Mappack[];
  /** Appends the create card at the end of the row. */
  showAddCard?: boolean;
  /** Arrow keys always drive a lone section; otherwise the hovered one wins. */
  isOnlySection: boolean;
  isLoading: boolean;
  emptyMessage: string;
}

export function MappackCarouselSection({
  mappacks,
  showAddCard = false,
  isOnlySection,
  isLoading,
  emptyMessage,
}: MappackCarouselSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  const items: Item[] = [
    ...mappacks.map((m) => ({ kind: "mappack" as const, data: m, id: m.id })),
    ...(showAddCard ? [{ kind: "add" as const, id: "__add__" }] : []),
  ];

  const {
    viewportRef,
    clonedTrack,
    effectiveCardWidth,
    viewportHeight,
    transitioning,
    translateX,
    onTransitionEnd,
    needsCarousel,
    prev,
    next,
    realPos,
    total,
    goToIndex,
    isDragging,
    onDragStart,
  } = useCarousel(items as (Item & CarouselItem)[], {
    keyboardEnabled: isOnlySection || isHovered,
  });

  return (
    <section
      className="mp-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mp-viewport" ref={viewportRef}>
        {needsCarousel && <CarouselArrow direction="prev" onClick={prev} />}

        {items.length === 0 ? (
          <div className="mp-empty">{isLoading ? "loading..." : emptyMessage}</div>
        ) : (
          <div
            className={`mp-track${transitioning ? " mp-track-transitioning" : ""}`}
            style={{
              transform: `translateX(${translateX}px)`,
              // Keeps the first card's skewed bottom-left corner from clipping.
              paddingLeft: `${viewportHeight * Math.tan(SKEW_RADIANS)}px`,
            }}
            onTransitionEnd={needsCarousel ? onTransitionEnd : undefined}
            onMouseDown={(e) => onDragStart(e.clientX)}
            onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
          >
            {clonedTrack.map((item) =>
              item.kind === "add" ? (
                <AddMappackCard key={item.cloneKey} width={effectiveCardWidth} />
              ) : (
                <MappackCard
                  key={item.cloneKey}
                  mappack={(item as any).data}
                  width={effectiveCardWidth}
                  isClone={item.isClone}
                  isDragging={isDragging}
                />
              ),
            )}
          </div>
        )}

        {needsCarousel && <CarouselArrow direction="next" onClick={next} />}

        {needsCarousel && items.length > 0 && (
          <CarouselDots total={total} active={realPos} onDotClick={goToIndex} />
        )}
      </div>
    </section>
  );
}
