"use client";
import { use } from "react";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { PageStatus } from "@/components/common/PageStatus";
import { SectionHeading } from "@/components/common/SectionHeading";
import { MappackProgressCard } from "@/components/player-profile/MappackProgressCard";
import { AchievementLog } from "@/components/player-profile/AchievementLog";

export default function PlayerProfilePage({ params }: { params: Promise<{ player: string }> }) {
  const { player: playerId } = use(params);
  const state = usePlayerProfile(playerId);

  if (state.status === "loading") {
    return <PageStatus pending>Loading player...</PageStatus>;
  }
  if (state.status === "not-found") {
    return <PageStatus>Player not found</PageStatus>;
  }
  if (state.status === "error") {
    return <PageStatus>Failed to load player</PageStatus>;
  }

  const { player, mappacks } = state.profile;

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-7 pt-9 pb-18">
      <h1 className="truncate font-display text-display-m">{player.name}</h1>

      <div className="grid gap-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
        <section>
          <SectionHeading className="mb-5">
            Mappacks
          </SectionHeading>
          {mappacks.length === 0 ? (
            <p className="py-12 text-center text-body text-muted-foreground">
              No mappacks played yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {mappacks.map((progress) => (
                <MappackProgressCard key={progress.mappack_id} progress={progress} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeading className="mb-2">
            Recent
          </SectionHeading>
          <AchievementLog playerId={playerId} />
        </section>
      </div>
    </div>
  );
}
