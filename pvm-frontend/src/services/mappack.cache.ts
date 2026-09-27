import { Mappack } from "@/types/mappack.types";

/**
 * Mappacks already fetched this session, keyed by mappack and player (the
 * response carries that player's progress). Lets a page show the last copy
 * straight away, e.g. when coming back from a track, while it refetches.
 */
const cache = new Map<string, Mappack>();

export const mappackCache = {
  key: (mappackId: string, playerId?: string) => `${mappackId}:${playerId ?? ""}`,
  get: (key: string) => cache.get(key),
  set: (key: string, mappack: Mappack) => cache.set(key, mappack),
};
