import { useEffect, useRef, useState } from "react";

const scrollPositions: Record<string, number> = {};

export function useScrollPosition(page: string, ready: boolean = true) {
  const [isRestored, setIsRestored] = useState(false);
  const lastRealPosition = useRef(scrollPositions[page] ?? 0);

  useEffect(() => {
    history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (!ready) return;

    const save = () => {
      const y = window.scrollY;
      if (y > 100) lastRealPosition.current = y;
    };
    window.addEventListener("scroll", save);

    const savedPosition = scrollPositions[page];

    if (savedPosition === undefined) {
      setIsRestored(true);
      return () => {
        window.removeEventListener("scroll", save);
        scrollPositions[page] = lastRealPosition.current;
        setIsRestored(false);
      };
    }

    const timer = setTimeout(() => {
      window.scrollTo({ top: savedPosition, behavior: "smooth" });
      setIsRestored(true);
    }, 200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", save);
      scrollPositions[page] = lastRealPosition.current;
      setIsRestored(false);
    };
  }, [page, ready]);

  return { isRestored };
}