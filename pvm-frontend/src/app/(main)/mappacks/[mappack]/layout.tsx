import type { Metadata } from "next";
import { Mappack } from "@/types/mappack.types";
import { fetchForMetadata, pageMetadata } from "@/lib/site";

type Params = Promise<{ mappack: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { mappack: mappackId } = await params;
  const mappack = await fetchForMetadata<Mappack>(`/mappacks/${mappackId}`);
  if (!mappack) return { title: "Mappack" };

  return pageMetadata({
    title: mappack.name,
    description: `Tracks, time goals and leaderboard for ${mappack.name}.`,
    path: `/mappacks/${mappackId}`,
    image: mappack.thumbnailURL,
  });
}

export default function MappackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
