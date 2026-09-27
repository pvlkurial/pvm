import { useEffect, useRef, useState } from "react";
import { TracksByTier } from "@/utils/mappack.utils";

/** How far down the viewport a tier's top has to pass to count as the one being read. */
const ACTIVE_LINE = 0.3;

export function useTierScroll(tracksByTier: TracksByTier, enabled: boolean = true) {
  const [activeTier, setActiveTier] = useState<string>("");
  const tierRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  // A tier picked from the sidebar stays active while the page scrolls to it,
  // until the user scrolls themselves. Otherwise a tier near the bottom would
  // lose to the last one as soon as the page runs out of room.
  const pinnedTier = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;

    // The active tier is the last one whose top has scrolled above the line,
    // or the first tier while the page is still above all of them.
    const update = () => {
      frame = 0;
      if (pinnedTier.current) return;
      const line = window.innerHeight * ACTIVE_LINE;
      const visible = Object.entries(tierRefs.current)
        .filter((entry): entry is [string, HTMLDivElement] => !!entry[1]?.offsetParent)
        .map(([name, el]) => ({ name, top: el.getBoundingClientRect().top }))
        .sort((a, b) => a.top - b.top);

      // Nothing visible means the maps tab is hidden; keep the last answer.
      if (visible.length === 0) return;

      // The last tier can't scroll up to the line once the page runs out, so
      // at the bottom of the page it wins regardless.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const passed = visible.filter((tier) => tier.top <= line);
      const active = atBottom ? visible.at(-1)! : (passed.at(-1) ?? visible[0]);
      setActiveTier(active.name);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const unpin = () => {
      pinnedTier.current = null;
    };
    const userScrollEvents = ["wheel", "touchmove", "keydown"] as const;

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    userScrollEvents.forEach((event) =>
      window.addEventListener(event, unpin, { passive: true }),
    );

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      userScrollEvents.forEach((event) => window.removeEventListener(event, unpin));
    };
  }, [tracksByTier, enabled]);

  const scrollToTier = (tier: string) => {
    pinnedTier.current = tier;
    setActiveTier(tier);
    tierRefs.current[tier]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return { activeTier, tierRefs, scrollToTier };
}
