"use client";
import { use } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import { useTrackDetails } from "@/hooks/useTrackDetails";
import { mappackCache } from "@/services/mappack.cache";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/common/BackButton";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { PageStatus } from "@/components/common/PageStatus";
import { TrackHero } from "@/components/track-detail/TrackHero";
import { TrackInfoCard } from "@/components/track-detail/TrackInfoCard";
import { TrackStatsGrid } from "@/components/track-detail/TrackStatsGrid";
import { TrackTimeGoals } from "@/components/track-detail/TrackTimeGoals";
import { TrackLeaderboard } from "@/components/track-detail/TrackLeaderboard";
import { ObsOverlayControls } from "@/components/track-detail/ObsOverlayControls";

function ExternalButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button asChild variant="outline" size="sm">
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <LuArrowUpRight className="size-3.5" />
      </a>
    </Button>
  );
}

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
    <div className="page-container flex flex-col gap-4 py-8">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <BackButton href={`/mappacks/${mappack}`} />
          <ExternalButton href={`https://trackmania.io/#/leaderboard/${track.mapUid}`}>
            Trackmania.io
          </ExternalButton>
          <ExternalButton
            href={`https://trackmania.exchange/mapshow/${track.tmxId ?? track.tmxID}`}
          >
            TMX
          </ExternalButton>
          <ObsOverlayControls track={track} mappackId={mappack} />
        </div>

        <Breadcrumbs
          items={[
            { label: "Mappacks", href: "/mappacks" },
            {
              label: mappackCache.findName(mappack) ?? mappack,
              href: `/mappacks/${mappack}`,
            },
            { label: track.name, useFormat: true },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <TrackHero thumbnailUrl={track.thumbnailUrl} />

        <div className="flex flex-col gap-4">
          <TrackInfoCard name={track.name} authorName={track.author} />
          <TrackStatsGrid tier={track.tier} recordsCount={track.records?.length || 0} />
          <TrackTimeGoals timeGoals={track.timegoals} personalBest={track.personalBest} />
        </div>
      </div>

      <TrackLeaderboard
        records={track.records}
        timeGoals={track.timegoals}
        trackId={track.id}
        mappackId={mappack}
      />
    </div>
  );
}
