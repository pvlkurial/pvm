import { useCallback, useEffect, useRef, useState } from "react";
import { playerService } from "@/services/player.service";
import { RecentAchievement } from "@/types/player.types";

const PAGE_SIZE = 20;

/** The player's achievement log, a page at a time. */
export function useRecentAchievements(playerId: string) {
  const [achievements, setAchievements] = useState<RecentAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  // Moving to another player's profile reuses this hook, so a page that
  // arrives for the previous player is dropped.
  const currentPlayer = useRef(playerId);

  const loadPage = useCallback(
    async (offset: number) => {
      setLoading(true);
      try {
        const page = await playerService.getRecentAchievements(playerId, PAGE_SIZE, offset);
        if (currentPlayer.current !== playerId) return;
        setAchievements((current) => (offset === 0 ? page : [...current, ...page]));
        // A short page is the last one.
        setHasMore(page.length === PAGE_SIZE);
      } catch (error) {
        console.error("Error fetching recent achievements:", error);
        setHasMore(false);
      } finally {
        if (currentPlayer.current === playerId) setLoading(false);
      }
    },
    [playerId],
  );

  useEffect(() => {
    currentPlayer.current = playerId;
    setAchievements([]);
    loadPage(0);
  }, [playerId, loadPage]);

  const loadMore = () => loadPage(achievements.length);

  return { achievements, loading, hasMore, loadMore };
}
