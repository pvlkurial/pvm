"use client";
import { use } from "react";
import { FaHeartbeat, FaMap } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useTrackDetails } from "@/hooks/useTrackDetails";
import { BackButton } from "@/components/common/BackButton";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ExternalIconLink } from "@/components/common/ExternalIconLink";
import { PageStatus } from "@/components/common/PageStatus";
import { TrackHero } from "@/components/track-detail/TrackHero";
import { TrackInfoCard } from "@/components/track-detail/TrackInfoCard";
import { TrackStatsGrid } from "@/components/track-detail/TrackStatsGrid";
import { TrackTimeGoals } from "@/components/track-detail/TrackTimeGoals";
import { TrackLeaderboard } from "@/components/track-detail/TrackLeaderboard";
import { ObsOverlayControls } from "@/components/track-detail/ObsOverlayControls";
import { OverlayPickButton } from "@/components/track-detail/OverlayPickButton";

export default function TrackPage({
  params,
}: {
  params: Promise<{ mappack: string; track: string }>;
}) {
  const { mappack, track: trackId } = use(params);
  const { user } = useAuth();
  const { track, loading, error } = useTrackDetails(mappack, trackId, user?.id);

  if (loading) {
    return <PageStatus pending>Loading...</PageStatus>;
  }

  if (error || !track) {
    return <PageStatus>Track not found</PageStatus>;
  }

  return (
    // 70% of wide screens; the 80rem floor keeps smaller screens roomy.
    <div className="mx-auto w-full max-w-[max(80rem,70vw)] px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BackButton href={`/mappacks/${mappack}`} />
          <ExternalIconLink
            href={`https://trackmania.io/#/leaderboard/${track.mapUid}`}
            label="View on Trackmania.io"
          >
            <FaHeartbeat />
          </ExternalIconLink>
          <ExternalIconLink
            href={`https://trackmania.exchange/mapshow/${track.tmxId ?? track.tmxID}`}
            label="View on TrackMania Exchange"
          >
            <FaMap />
          </ExternalIconLink>
          <OverlayPickButton mappackId={mappack} trackId={track.id} />
        </div>

        <Breadcrumbs
          items={[
            { label: "Mappacks", href: "/mappacks" },
            { label: mappack, href: `/mappacks/${mappack}` },
            { label: track.name, useFormat: true },
          ]}
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-[clamp(420px,33%,640px)_1fr]">
        <TrackHero thumbnailUrl={track.thumbnailUrl} />

        <div className="flex flex-col gap-6">
          <TrackInfoCard
            name={track.name}
            authorName={track.author}
            dominantColor={track.dominantColor}
          />
          <TrackStatsGrid
            tier={track.tier}
            recordsCount={track.records?.length || 0}
          />
          <TrackTimeGoals
            timeGoals={track.timegoals}
            personalBest={track.personalBest}
          />
        </div>
      </div>

      <TrackLeaderboard
        records={track.records}
        timeGoals={track.timegoals}
        trackId={track.id}
        mappackId={mappack}
      />

      <div className="mt-3">
        <ObsOverlayControls track={track} mappackId={mappack} />
      </div>
    </div>
  );
}
