"use client";
import { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTrackDetails } from "@/hooks/useTrackDetails";
import { TrackHero } from "@/app/_components/track-detail/TrackHero";
import { TrackInfoCard } from "@/app/_components/track-detail/TrackInfoCard";
import { TrackStatsGrid } from "@/app/_components/track-detail/TrackStatsGrid";
import { TrackTimeGoals } from"@/app/_components/track-detail/TrackTimeGoals";
import { TrackLeaderboard } from "@/app/_components/track-detail/TrackLeaderboard";
import { UpdateRecordsButton } from "@/app/_components/track-detail/UpdateRecordsButton";
import RequireRole from "@/app/_components/RequireRole";

export default function TrackPage({
  params,
}: {
  params: Promise<{ mappack: string; track: string }>;
}) {
  const { mappack, track: trackId } = use(params);
  const { user } = useAuth();
  const { track, loading, error } = useTrackDetails(mappack, trackId, user?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-ruigslay text-white/70 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-ruigslay text-red-500">
          Track not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[90rem] mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid lg:grid-cols-[500px_1fr] gap-6 mb-8">
        <TrackHero
          thumbnailUrl={track.thumbnailUrl}
          dominantColor={track.dominantColor}
        />

        <div className="flex flex-col gap-6">
          <TrackInfoCard
            name={track.name}
            authorName={track.author}
            dominantColor={track.dominantColor}
          />

          <TrackStatsGrid
            tier={track.tier}
            recordsCount={track.records?.length || 0}
            dominantColor={track.dominantColor}
          />

          <TrackTimeGoals timeGoals={track.timegoals} personalBest={track.personalBest} />

        </div>
      </div>

      {/* Leaderboard Section */}
      <TrackLeaderboard 
        records={track.records} 
        timeGoals={track.timegoals}
        trackId={track.id}
      />
    </div>
  );
}