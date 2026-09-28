"use client";
import { useRecentAchievements } from "@/hooks/useRecentAchievements";
import { Button } from "@/components/ui/button";
import { AchievementLogEntry } from "./AchievementLogEntry";

/** The player's latest improvements, newest first, with more loaded on demand. */
export function AchievementLog({ playerId }: { playerId: string }) {
  const { achievements, loading, hasMore, loadMore } = useRecentAchievements(playerId);

  if (achievements.length === 0) {
    return (
      <p className="py-12 text-center text-body text-muted-foreground">
        {loading ? "Loading..." : "Nothing achieved yet"}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="divide-y divide-border">
        {achievements.map((achievement) => (
          <AchievementLogEntry
            key={`${achievement.mappack_id}:${achievement.track_id}`}
            achievement={achievement}
          />
        ))}
      </ul>

      {hasMore && (
        <Button variant="outline" className="self-center" loading={loading} onClick={loadMore}>
          Load more
        </Button>
      )}
    </div>
  );
}
