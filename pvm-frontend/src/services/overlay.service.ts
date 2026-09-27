import { API_BASE } from "@/constants/miscellaneous";
import { authenticatedFetch } from "./api";

/** What a player's OBS overlay shows; one row per player on the backend. */
export interface OverlaySelection {
  player_id: string;
  mappack_id: string;
  track_id: string;
  /** A time goal's name, "WR", or empty for the easiest goal. */
  goal: string;
  updated_at: string;
}

async function update(body: Record<string, string>): Promise<OverlaySelection> {
  const response = await authenticatedFetch("/overlay", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to update overlay (HTTP ${response.status})`);
  }
  return response.json();
}

export const overlayService = {
  /** Public, so OBS can read it without signing in. Null if nothing is selected yet. */
  get: async (playerId: string): Promise<OverlaySelection | null> => {
    const response = await fetch(`${API_BASE}/overlay/${playerId}`, { cache: "no-store" });
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Failed to load overlay (HTTP ${response.status})`);
    }
    return response.json();
  },

  selectTrack: (mappackId: string, trackId: string) =>
    update({ mappack_id: mappackId, track_id: trackId }),

  selectGoal: (goal: string) => update({ goal }),
};
