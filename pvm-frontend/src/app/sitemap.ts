import type { MetadataRoute } from "next";
import { Mappack } from "@/types/mappack.types";
import { SITE_URL, fetchForMetadata } from "@/lib/site";

/** Rebuilt hourly, so new mappacks and tracks show up without a redeploy. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [mappacks, campaigns] = await Promise.all([
    fetchForMetadata<Mappack[]>("/mappacks"),
    fetchForMetadata<Mappack[]>("/campaigns"),
  ]);
  const listed = [...(mappacks ?? []), ...(campaigns ?? [])];

  // The listing omits tracks, so each mappack is fetched for its track ids.
  const details = await Promise.all(
    listed.map((mappack) => fetchForMetadata<Mappack>(`/mappacks/${mappack.id}`)),
  );

  const mappackEntries = details.flatMap((mappack) => {
    if (!mappack) return [];
    const base = `${SITE_URL}/mappacks/${mappack.id}`;
    return [
      { url: base, changeFrequency: "daily" as const, priority: 0.8 },
      ...(mappack.MappackTrack ?? []).map((track) => ({
        url: `${base}/${track.track_id}`,
        changeFrequency: "daily" as const,
        priority: 0.5,
      })),
    ];
  });

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/mappacks`, changeFrequency: "daily", priority: 0.9 },
    ...mappackEntries,
  ];
}
