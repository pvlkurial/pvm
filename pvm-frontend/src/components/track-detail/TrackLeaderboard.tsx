"use client";
import { Record, Track } from "@/types/mappack.types";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { RecordsTable } from "./RecordsTable";
import { UpdateRecordsButton } from "./UpdateRecordsButton";

interface TrackLeaderboardProps {
  records?: Record[] | null;
  timeGoals?: Track["timegoals"] | null;
  trackId: string;
}

export function TrackLeaderboard({
  records,
  timeGoals,
  trackId,
}: TrackLeaderboardProps) {
  const { user } = useAuth();

  return (
    <Card>
      <CardContent>
        <div className="mb-6 flex flex-wrap items-center gap-4">
          {/* Indented so the title starts where the table's "#" column does. */}
          <h2 className="pl-[25px] font-display text-display-m md:pl-[30px]">Leaderboard</h2>
          <UpdateRecordsButton trackId={trackId} onSuccess={() => window.location.reload()} />
        </div>
        <RecordsTable
          records={records}
          timeGoals={timeGoals}
          loggedInPlayerId={user?.id}
        />
      </CardContent>
    </Card>
  );
}
