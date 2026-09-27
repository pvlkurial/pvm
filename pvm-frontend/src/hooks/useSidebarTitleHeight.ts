import { useCallback, useRef } from "react";

/**
 * Returns a ref callback for a container. While attached, it keeps
 * --sidebar-title-height on that container equal to the tallest
 * [data-sidebar-title] inside it, re-measuring as titles mount or resize.
 */
export function useSidebarTitleHeight<T extends HTMLElement>() {
  const cleanup = useRef<() => void>(undefined);

  return useCallback((container: T | null) => {
    cleanup.current?.();
    cleanup.current = undefined;
    if (!container) return;

    const titles = () => [...container.querySelectorAll<HTMLElement>("[data-sidebar-title]")];

    const resizes = new ResizeObserver(() => {
      const tallest = Math.max(0, ...titles().map((title) => title.offsetHeight));
      container.style.setProperty("--sidebar-title-height", `${tallest}px`);
    });

    const observeAll = () => {
      resizes.disconnect();
      titles().forEach((title) => resizes.observe(title));
    };

    // Titles come and go, e.g. My Stats only once the player's stats load.
    const mutations = new MutationObserver(observeAll);
    mutations.observe(container, { childList: true, subtree: true });
    observeAll();

    cleanup.current = () => {
      mutations.disconnect();
      resizes.disconnect();
    };
  }, []);
}
