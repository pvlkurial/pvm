import type { Metadata } from "next";
import { Track } from "@/types/mappack.types";
import { fetchForMetadata, pageMetadata } from "@/lib/site";
import { stripFormatting } from "@/utils/text.utils";

type Params = Promise<{ mappack: string; track: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { mappack, track: trackId } = await params;
  const track = await fetchForMetadata<Track>(`/mappacks/${mappack}/tracks/${trackId}`);
  if (!track) return { title: "Track" };

  const name = stripFormatting(track.name);
  return pageMetadata({
    title: name,
    description: `${name} by ${track.author}: time goals and leaderboard.`,
    path: `/mappacks/${mappack}/${trackId}`,
    image: track.thumbnailUrl,
  });
}

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
