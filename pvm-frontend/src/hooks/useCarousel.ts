import { useState, useEffect, useRef, useCallback } from "react";

const SM_BREAKPOINT = 640;
const STEP = 2;

export type CarouselItem = {
  id: string;
  [key: string]: unknown;
};

export type TrackItem<T extends CarouselItem> = T & {
  isClone: boolean;
  cloneKey: string;
};

export function useCarousel<T extends CarouselItem>(items: T[]) {
  const [visible, setVisible] = useState(4);
  const [pos, setPos] = useState(4);
  const [transitioning, setTransitioning] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const total = items.length;
  const needsCarousel = total > visible;

  const effectiveCardWidth = cardWidth;

  // ── Measure ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current) return;
      const w = viewportRef.current.offsetWidth;
      const v = w < SM_BREAKPOINT ? 2 : 4;
      setVisible(v);
      setCardWidth(w / v);
      setPos((p) => {
        if (total === 0) return v;
        const realIdx = Math.max(
          0,
          Math.min(((p - v + total) % total), total - 1)
        );
        return v + realIdx;
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [total]);

  // ── Cloned track ─────────────────────────────────────────────────────────
  const clonedTrack: TrackItem<T>[] = needsCarousel
    ? [
        ...items
          .slice(-visible)
          .map((item, i) => ({ ...item, isClone: true, cloneKey: `pre-${i}` })),
        ...items.map((item) => ({ ...item, isClone: false, cloneKey: item.id })),
        ...items
          .slice(0, visible)
          .map((item, i) => ({ ...item, isClone: true, cloneKey: `post-${i}` })),
      ]
    : items.map((item) => ({ ...item, isClone: false, cloneKey: item.id }));

  // ── Transition end — silent jump back to real cards ───────────────────────
  const onTransitionEnd = useCallback(() => {
    lockRef.current = false;
    setTransitioning(false);
    setPos((p) => {
      if (p < visible) return p + total;
      if (p >= visible + total) return p - total;
      return p;
    });
  }, [total, visible]);

  // ── Arrow navigation ──────────────────────────────────────────────────────
  const go = useCallback(
    (dir: 1 | -1) => {
      if (lockRef.current || !needsCarousel) return;
      lockRef.current = true;
      setTransitioning(true);
      setPos((p) => p + dir * STEP);
    },
    [needsCarousel]
  );

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

  // ── Drag ──────────────────────────────────────────────────────────────────
  const getClientX = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e)
      return e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX ?? 0;
    return e.clientX;
  };

  const onDragStart = useCallback(
    (clientX: number) => {
      if (!needsCarousel) return;
      dragStartX.current = clientX;
      isDragging.current = false;
      setTransitioning(false);
      lockRef.current = true;
    },
    [needsCarousel]
  );

  const onDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (dragStartX.current === null) return;
    const dx = getClientX(e) - dragStartX.current;
    if (Math.abs(dx) > 5) isDragging.current = true;
    setDragOffset(dx);
  }, []);

  const onDragEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
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
      setPos((p) => p + clamped);
    },
    [effectiveCardWidth]
  );

  useEffect(() => {
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchmove", onDragMove, { passive: true });
    window.addEventListener("touchend", onDragEnd);
    return () => {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
      window.removeEventListener("touchmove", onDragMove);
      window.removeEventListener("touchend", onDragEnd);
    };
  }, [onDragMove, onDragEnd]);

  const realPos = needsCarousel ? ((pos - visible) % total + total) % total : 0;
  const translateX = needsCarousel ? -pos * effectiveCardWidth + dragOffset : 0;

  const goToIndex = useCallback(
    (i: number) => {
      if (lockRef.current) return;
      lockRef.current = true;
      setTransitioning(true);
      setPos(visible + i);
    },
    [visible]
  );

  return {
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
  };
}