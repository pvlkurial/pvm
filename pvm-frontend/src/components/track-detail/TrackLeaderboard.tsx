"use client";
import { Record, Track } from "@/types/mappack.types";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { RequireMappackPermission } from "@/components/common/RequireMappackPermission";
import { RecordsTable } from "./RecordsTable";
import { UpdateRecordsButton } from "./UpdateRecordsButton";

interface TrackLeaderboardProps {
  records?: Record[] | null;
  timeGoals?: Track["timegoals"] | null;
  trackId: string;
  mappackId: string;
}

export function TrackLeaderboard({
  records,
  timeGoals,
  trackId,
  mappackId,
}: TrackLeaderboardProps) {
  const { user } = useAuth();

  return (
    <Card>
      <CardContent>
        <div className="mb-6 flex items-center gap-4">
          {/* Indented so the title starts where the table's "#" column does. */}
          <h2 className="pl-[25px] font-display text-display-m md:pl-[30px]">Leaderboard</h2>
          <RequireMappackPermission mappackId={mappackId}>
            <UpdateRecordsButton
              trackId={trackId}
              playerId={user?.id || ""}
              onSuccess={() => window.location.reload()}
            />
          </RequireMappackPermission>
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
