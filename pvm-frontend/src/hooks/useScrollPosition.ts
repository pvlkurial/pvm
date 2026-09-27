import { useEffect, useLayoutEffect, useRef, useState } from "react";

const scrollPositions: Record<string, number> = {};

/**
 * Remembers how far down `page` was scrolled and jumps straight back there on
 * return, once `ready` says the content is rendered.
 */
export function useScrollPosition(page: string, ready: boolean = true) {
  const [isRestored, setIsRestored] = useState(false);
  const lastRealPosition = useRef(scrollPositions[page] ?? 0);

  useEffect(() => {
    history.scrollRestoration = "manual";
  }, []);

  // A layout effect so the jump happens before paint, without a flash of the
  // top of the page.
  useLayoutEffect(() => {
    if (!ready) return;

    const savedPosition = scrollPositions[page];
    if (savedPosition !== undefined) {
      window.scrollTo({ top: savedPosition, behavior: "instant" });
    }
    setIsRestored(true);

    const save = () => {
      const y = window.scrollY;
      if (y > 100) lastRealPosition.current = y;
    };
    window.addEventListener("scroll", save);

    return () => {
      window.removeEventListener("scroll", save);
      scrollPositions[page] = lastRealPosition.current;
      setIsRestored(false);
    };
  }, [page, ready]);

  return { isRestored };
}
