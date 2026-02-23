import { useEffect, useRef, useState } from 'react';
import { MappackTrack, MappackTier } from '@/types/mappack.types';

export function useTierScroll(
  tracksByTier: Record<string, { tier: MappackTier | null; tracks: MappackTrack[] }>,
  enabled: boolean = true
) {
  const [activeTier, setActiveTier] = useState<string>("");
  const tierRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTier(entry.target.getAttribute("data-tier") || "");
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    );

    Object.values(tierRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [tracksByTier, enabled]);

  const scrollToTier = (tier: string) => {
    tierRefs.current[tier]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return { activeTier, tierRefs, scrollToTier };
}