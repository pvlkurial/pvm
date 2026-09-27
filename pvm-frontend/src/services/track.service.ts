import { Track } from "@/types/mappack.types";
import { authenticatedFetch } from "./api";
import axios from "axios";
import { API_BASE } from "@/constants/miscellaneous";

interface AddTrackToMappackParams {
  mappackId: string;
  trackId: string;
  tmxId: string;
}

export type RecordRefreshResult =
  | { status: "refreshed" }
  | { status: "cooldown"; retryAfterSeconds: number }
  | { status: "no-record" };

interface TimeGoalValue {
  time_goal_id: number;
  time: number;
}

export const trackService = {
  addToMappack: async ({
    mappackId,
    trackId,
    tmxId,
  }: AddTrackToMappackParams): Promise<void> => {
    await axios.post(`${API_BASE}/mappacks/${mappackId}/tracks/${trackId}`, {
      tmxId,
    });
  },

  addTimeGoals: async (
    mappackId: string,
    trackId: string,
    timeGoals: TimeGoalValue[],
  ): Promise<void> => {
    if (timeGoals.length === 0) return;

    await axios.patch(
      `${API_BASE}/mappacks/${mappackId}/tracks/${trackId}/timegoals`,
      timeGoals,
    );
  },

  getTrackDetails: async (
    mappackId: string,
    trackId: string,
    playerId?: string,
  ): Promise<Track> => {
    const url = playerId
      ? `${API_BASE}/mappacks/${mappackId}/tracks/${trackId}?player_id=${playerId}`
      : `${API_BASE}/mappacks/${mappackId}/tracks/${trackId}`;

    const response = await axios.get<Track>(url);
    return response.data;
  },

  /**
   * Pulls the signed-in user's own record for a track from Nadeo. Limited to
   * supporters and superadmins, and to one refresh every 5 minutes across all tracks.
   */
  refreshOwnRecord: async (trackId: string): Promise<RecordRefreshResult> => {
    const response = await authenticatedFetch(`/tracks/${trackId}/records/refresh`, {
      method: "POST",
    });
    if (response.ok) return { status: "refreshed" };

    const body = await response.json().catch(() => ({}));
    if (response.status === 429) {
      return { status: "cooldown", retryAfterSeconds: body.retry_after_seconds ?? 300 };
    }
    if (response.status === 404) return { status: "no-record" };
    throw new Error(body.error ?? `Record refresh failed (HTTP ${response.status})`);
  },

  // FETCH TRACKS RIGHT AFTER ADDING A NEW TRACK
  fetchRecords: async (trackId: string): Promise<void> => {
    await axios.post(`${API_BASE}/tracks/${trackId}/records`);
  },

  /** Updates the Trackmania Exchange id for a track. */
  updateTmxId: async (trackId: string, tmxID: string): Promise<void> => {
    const response = await authenticatedFetch(`/tracks/${trackId}`, {
      method: "PATCH",
      body: JSON.stringify({ tmxID }),
    });

    if (!response.ok) {
      let message = "";
      try {
        message = (await response.json()).error ?? "";
      } catch {
        // Not our JSON error shape, so this is the server's own response —
        // most likely the route is missing because the backend predates it.
      }
      throw new Error(
        message
          ? `${message} (HTTP ${response.status})`
          : `the server returned HTTP ${response.status} for PATCH /tracks/${trackId}`,
      );
    }
  },
};
