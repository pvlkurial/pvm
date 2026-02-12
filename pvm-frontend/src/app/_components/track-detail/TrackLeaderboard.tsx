// components/track-detail/TrackLeaderboard.tsx
import { Card, CardBody } from "@heroui/react";
import { FaDatabase } from "react-icons/fa";
import RecordsTable from "@/app/_components/RecordsTable";
import { Record } from "@/types/mappack.types";
import RequireRole from "../RequireRole";
import { UpdateRecordsButton } from "./UpdateRecordsButton";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedContent from "../ProtectedContent";

interface TimeGoal {
  name: string;
  time: number;
}

interface TrackLeaderboardProps {
  records: Record[];
  timeGoals: TimeGoal[];
  trackId: string;
}

export function TrackLeaderboard({ records, timeGoals, trackId }: TrackLeaderboardProps) {
    const { user } = useAuth();
  
  return (
    <Card className="bg-neutral-90 border border-blue-500/30">
      <CardBody className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaDatabase className="w-6 h-6 text-blue-500/70" />
          <h3 className="text-3xl font-ruigslay font-bold">Leaderboard</h3>
      <ProtectedContent>
        <UpdateRecordsButton 
          trackId={trackId || ""} 
          playerId={user?.id || ""} 
          onSuccess={() => window.location.reload()}
        />
      </ProtectedContent>
        </div>
        <RecordsTable records={records} timeGoals={timeGoals} />
      </CardBody>
    </Card>
  );
}