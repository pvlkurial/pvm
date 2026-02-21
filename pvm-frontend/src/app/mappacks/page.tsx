"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mappack } from "@/types/mappack.types";
import { useAuth } from "@/contexts/AuthContext";
import { useCarousel, CarouselItem } from "@/hooks/useCarousel";
import MappackCard from "@/app/_components/MappackCard";
import AddMappackCard from "@/app/_components/AddMappackCard";
import CarouselArrow from "@/app/_components/CarouselArrow";
import CarouselDots from "@/app/_components/CarouselDots";
import "./mappacks.css";

type Item =
  | { kind: "mappack"; data: Mappack; id: string }
  | { kind: "add"; id: string };

export default function MapppacksPage() {
  const [mappacks, setMappacks] = useState<Mappack[]>([]);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Disable page scroll only while on this page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE}/mappacks`)
      .then((r) => setMappacks(r.data))
      .catch((err) => console.log(err.message));
  }, []);

  const items: Item[] = [
    ...mappacks.map((m) => ({ kind: "mappack" as const, data: m, id: m.id })),
    ...(isAdmin ? [{ kind: "add" as const, id: "__add__" }] : []),
  ];

  const {
    viewportRef,
    clonedTrack,
    effectiveCardWidth,
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
  } = useCarousel(items as (Item & CarouselItem)[]);

  return (
    <div className="mp-viewport" ref={viewportRef}>
      {needsCarousel && <CarouselArrow direction="prev" onClick={prev} />}

      {items.length === 0 ? (
        <div className="mp-empty">loading...</div>
      ) : (
        <div
          className={`mp-track${transitioning ? " mp-track-transitioning" : ""}`}
          style={{ transform: `translateX(${translateX}px)` }}
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
            )
          )}
        </div>
      )}

      {needsCarousel && <CarouselArrow direction="next" onClick={next} />}

      {needsCarousel && items.length > 0 && (
        <CarouselDots total={total} active={realPos} onDotClick={goToIndex} />
      )}
    </div>
  );
}