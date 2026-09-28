import type { Metadata } from "next";
import { PlayerProfile } from "@/types/player.types";
import { fetchForMetadata, pageMetadata } from "@/lib/site";

type Params = Promise<{ player: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { player: playerId } = await params;
  const profile = await fetchForMetadata<PlayerProfile>(`/players/${playerId}/profile`);
  if (!profile) return { title: "Player" };

  const { name } = profile.player;
  return pageMetadata({
    title: name,
    description: `${name}'s mappack progress and recent achievements.`,
    path: `/players/${playerId}`,
  });
}

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
