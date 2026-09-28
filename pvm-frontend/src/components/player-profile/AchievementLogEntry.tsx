import Link from "next/link";
import { RecentAchievement } from "@/types/player.types";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { formatRelativeTime } from "@/utils/date.utils";
import { FormattedText } from "@/components/common/FormattedText";

export function AchievementLogEntry({ achievement }: { achievement: RecentAchievement }) {
  return (
    <li className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <Link
          href={`/mappacks/${achievement.mappack_id}/${achievement.track_id}`}
          className="block truncate text-ui leading-snug text-foreground hover:underline"
        >
          <FormattedText text={achievement.track_name} />
        </Link>
        <Link
          href={`/mappacks/${achievement.mappack_id}`}
          className="block truncate text-small text-muted-foreground transition-colors hover:text-foreground"
        >
          {achievement.mappack_name}
        </Link>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-ui leading-snug tabular-nums">
          {achievement.goal_name}
          <span className="ml-2 text-muted-foreground">
            {millisecondsToTimeString(achievement.player_time)}
          </span>
        </p>
        <time
          dateTime={achievement.achieved_at}
          title={new Date(achievement.achieved_at).toLocaleString()}
          className="text-small text-faint"
        >
          {formatRelativeTime(achievement.achieved_at)}
        </time>
      </div>
    </li>
  );
}
