"use client"
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import RequireRole from "../_components/RequireRole";
import CreateMappackModal from "../_components/CreateMappackModal";
import { Mappack } from "@/types/mappack.types";
import { useAuth } from "@/contexts/AuthContext";
import MapStyleIcon from "../_components/MapStyleIcon";

const STEP = 2;
const SM_BREAKPOINT = 640;

type Item =
  | { kind: "mappack"; data: Mappack; id: string }
  | { kind: "add"; id: string };

type TrackItem = Item & { isClone: boolean; cloneKey: string };

export default function Home() {
  const [mappacks, setMappacks] = useState<Mappack[]>([]);
  const [visible, setVisible] = useState(4);
  const [pos, setPos] = useState(4);
  const [transitioning, setTransitioning] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    axios
      .get(`${API_BASE}/mappacks`)
      .then((r) => setMappacks(r.data))
      .catch((err) => console.log(err.message));
  }, []);

  // Build the flat items list (mappacks + optional add card)
  const items: Item[] = [
    ...mappacks.map(m => ({ kind: "mappack" as const, data: m, id: m.id })),
    ...(isAdmin ? [{ kind: "add" as const, id: "__add__" }] : []),
  ];
  const total = items.length;

  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current) return;
      const w = viewportRef.current.offsetWidth;
      const v = w < SM_BREAKPOINT ? 2 : 4;
      setVisible(v);
      setCardWidth(w / v);
      setPos(p => {
        if (total === 0) return v;
        const realIdx = Math.max(0, Math.min((p - v + total) % total, total - 1));
        return v + realIdx;
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [total]);

  const needsCarousel = total > visible;

  const effectiveCardWidth = !needsCarousel && total > 0
    ? (cardWidth * visible) / total
    : cardWidth;

  // Build cloned track: [last V] + [all real] + [first V]
  const clonedTrack: TrackItem[] = needsCarousel ? [
    ...items.slice(-visible).map((item, i) => ({ ...item, isClone: true,  cloneKey: `pre-${i}` })),
    ...items.map(item =>                        ({ ...item, isClone: false, cloneKey: item.id })),
    ...items.slice(0, visible).map((item, i) => ({ ...item, isClone: true,  cloneKey: `post-${i}` })),
  ] : items.map(item => ({ ...item, isClone: false, cloneKey: item.id }));

  const onTransitionEnd = useCallback(() => {
    lockRef.current = false;
    setTransitioning(false);
    setPos(p => {
      if (p < visible)          return p + total;
      if (p >= visible + total) return p - total;
      return p;
    });
  }, [total, visible]);

  const go = useCallback((dir: 1 | -1) => {
    if (lockRef.current || !needsCarousel) return;
    lockRef.current = true;
    setTransitioning(true);
    setPos(p => p + dir * STEP);
  }, [needsCarousel]);

  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const getClientX = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ("touches" in e) return e.touches[0]?.clientX ?? (e as TouchEvent).changedTouches[0]?.clientX ?? 0;
    return (e as MouseEvent).clientX;
  };

  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!needsCarousel) return;
    dragStartX.current = getClientX(e);
    isDragging.current = false;
    setTransitioning(false);
    lockRef.current = true;
  }, [needsCarousel]);

  const onDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (dragStartX.current === null) return;
    const dx = getClientX(e) - dragStartX.current;
    if (Math.abs(dx) > 5) isDragging.current = true;
    setDragOffset(dx);
  }, []);

  const onDragEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (dragStartX.current === null) return;
    const dx = getClientX(e) - dragStartX.current;
    dragStartX.current = null;
    setDragOffset(0);
    const threshold = effectiveCardWidth * 0.25;
    if (Math.abs(dx) < threshold) {
      lockRef.current = false;
      return;
    }
    const steps = Math.round(-dx / effectiveCardWidth);
    const clamped = Math.max(-STEP * 2, Math.min(STEP * 2, steps));
    setTransitioning(true);
    setPos(p => p + clamped);
  }, [effectiveCardWidth]);

  useEffect(() => {
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup",   onDragEnd);
    window.addEventListener("touchmove", onDragMove, { passive: true });
    window.addEventListener("touchend",  onDragEnd);
    return () => {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup",   onDragEnd);
      window.removeEventListener("touchmove", onDragMove);
      window.removeEventListener("touchend",  onDragEnd);
    };
  }, [onDragMove, onDragEnd]);

  const realPos = needsCarousel ? ((pos - visible) % total + total) % total : 0;
  const translateX = needsCarousel ? -pos * effectiveCardWidth + dragOffset : 0;

  return (
    <>
      <style>{`
        html, body { overflow: hidden; }

        .mp-viewport {
          position: relative;
          width: 100%;
          height: calc(100vh - 140px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          user-select: none;
        }

        .mp-track {
          display: flex;
          flex: 1;
          min-height: 0;
          cursor: grab;
        }
        .mp-track:active { cursor: grabbing; }
        .mp-track.is-transitioning {
          transition: transform 0.45s cubic-bezier(0.77, 0, 0.175, 1);
          cursor: grab;
        }

        .mp-card, .mp-add-wrap {
          position: relative;
          flex-shrink: 0;
          height: 100%;
        }
        .mp-card { z-index: 2; text-decoration: none; color: inherit; }
        .mp-card:hover { z-index: 10; }
        .mp-add-wrap { z-index: 2; }

        .mp-inner, .mp-add-inner {
          position: absolute;
          top: 0; bottom: 0; left: 0;
          right: -20px;
          transform: skewX(-10deg);
          overflow: hidden;
          border-right: 1px solid rgba(255,255,255,0.07);
          transition: box-shadow 0.3s ease;
        }
        .mp-inner { background: #080b10; }
        .mp-card:hover .mp-inner { box-shadow: 8px 0 40px rgba(0,0,0,0.7); }

        .mp-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.6);
          transition: filter 0.35s ease, transform 0.35s ease;
          pointer-events: none;
        }
        .mp-card:hover .mp-img { filter: brightness(0.82); transform: scale(1.04); }

        .mp-grad {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top,
            rgba(0,0,0,0.95) 0%,
            rgba(0,0,0,0.3) 40%,
            transparent 68%
          );
          pointer-events: none;
        }

        .mp-accent {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,0.22);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .mp-card:hover .mp-accent { opacity: 1; }

        .mp-text {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 28px 36px;
          z-index: 2;
          transform: skewX(10deg);
          pointer-events: none;
        }
        .mp-name {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #fff;
          line-height: 1.1;
        }
        .mp-count {
          font-size: 11px;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.35);
          margin-top: 6px;
        }

        .mp-style-icon {
          position: absolute;
          top: 20px;
          right: 52px;
          z-index: 3;
          transform: skewX(10deg);
          pointer-events: all;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .mp-style-icon .mp-style-svg {
          width: 68px;
          height: 68px;
          opacity: 0.18;
          transition: opacity 0.3s;
          display: block;
        }
        .mp-card:hover .mp-style-icon .mp-style-svg {
          opacity: 0.4;
        }
        .mp-style-icon:hover .mp-style-svg {
          opacity: 0.6;
        }
        .mp-style-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0);
          transition: color 0.25s;
          white-space: nowrap;
        }
        .mp-style-icon:hover .mp-style-label {
          color: rgba(255,255,255,0.55);
        }

        .mp-add-inner {
          background: transparent;
          border: 1px dashed rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s;
        }
        .mp-add-wrap:hover .mp-add-inner {
          border-color: rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.03);
        }
        .mp-add-content {
          transform: skewX(10deg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          pointer-events: none;
          user-select: none;
          color: rgba(255,255,255,0.25);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: color 0.25s;
        }
        .mp-add-wrap:hover .mp-add-content { color: rgba(255,255,255,0.5); }
        .mp-add-icon {
          font-size: 32px;
          line-height: 1;
          font-weight: 200;
        }
        .mp-add-modal-trigger {
          position: absolute;
          inset: 0;
          transform: skewX(-10deg);
          opacity: 0;
          cursor: pointer;
          z-index: 20;
        }
        .mp-add-modal-trigger button,
        .mp-add-modal-trigger [role="button"] {
          width: 100%; height: 100%;
          background: transparent !important;
          border: none !important;
          cursor: pointer;
        }

        .mp-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          width: 40px; height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
          opacity: 0.5;
          transition: opacity 0.2s, background 0.2s;
          backdrop-filter: blur(4px);
        }
        .mp-arrow:hover { opacity: 1; background: rgba(0,0,0,0.75); }
        .mp-arrow svg { width: 16px; height: 16px; stroke: currentColor; stroke-width: 2; fill: none; }
        .mp-arrow-prev { left: 12px; }
        .mp-arrow-next { right: 12px; }
        @media (max-width: 639px) { .mp-arrow { display: none; } }

        .mp-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 14px 0;
          flex-shrink: 0;
        }
        .mp-dot {
          height: 3px; width: 20px;
          background: rgba(255,255,255,0.15);
          border: none;
          cursor: pointer;
          transform: skewX(-12deg);
          transition: all 0.3s ease;
          padding: 0;
        }
        .mp-dot.is-active { width: 40px; background: rgba(255,255,255,0.6); }

        .mp-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.2);
          font-size: 13px;
          letter-spacing: 0.15em;
        }
      `}</style>

      <div className="mp-viewport" ref={viewportRef}>
        {needsCarousel && (
          <button className="mp-arrow mp-arrow-prev" onClick={prev} aria-label="Previous">
            <svg viewBox="0 0 16 16"><polyline points="10,2 4,8 10,14" /></svg>
          </button>
        )}

        {items.length === 0 ? (
          <div className="mp-empty">loading...</div>
        ) : (
          <div
            className={`mp-track${transitioning ? " is-transitioning" : ""}`}
            style={{ transform: `translateX(${translateX}px)` }}
            onTransitionEnd={needsCarousel ? onTransitionEnd : undefined}
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
          >
            {clonedTrack.map((item) => {
              if (item.kind === "add") {
                return (
                  <div key={item.cloneKey} className="mp-add-wrap" style={{ width: effectiveCardWidth }}>
                    <div className="mp-add-inner">
                      <div className="mp-add-content">
                        <span className="mp-add-icon">+</span>
                        <span>Add Mappack</span>
                      </div>
                    </div>
                    <div className="mp-add-modal-trigger">
                      <CreateMappackModal />
                    </div>
                  </div>
                );
              }

              const mappack = item.data;
              return (
                <Link
                  key={item.cloneKey}
                  href={`/mappacks/${mappack.id}`}
                  className="mp-card"
                  style={{ width: effectiveCardWidth }}
                  tabIndex={item.isClone ? -1 : 0}
                  draggable={false}
                  onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
                >
                  <div className="mp-inner">
                    <div className="mp-img" style={{ backgroundImage: `url(${mappack.thumbnailURL})` }} />
                    <div className="mp-grad" />
                    <div className="mp-accent" />
                    {(mappack as any).mapStyleName && (
                      <MapStyleIcon styleKey={(mappack as any).mapStyleName} className="mp-style-icon" />
                    )}
                    <div className="mp-text">
                      <div className="mp-name">{mappack.name}</div>
                      {mappack.MappackTrack?.length > 0 && (
                        <div className="mp-count">{mappack.MappackTrack.length} tracks</div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {needsCarousel && (
          <button className="mp-arrow mp-arrow-next" onClick={next} aria-label="Next">
            <svg viewBox="0 0 16 16"><polyline points="6,2 12,8 6,14" /></svg>
          </button>
        )}

        {needsCarousel && items.length > 0 && (
          <div className="mp-dots">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                className={`mp-dot${i === realPos ? " is-active" : ""}`}
                onClick={() => { if (!lockRef.current) setPos(visible + i); }}
                aria-label={`Item ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}