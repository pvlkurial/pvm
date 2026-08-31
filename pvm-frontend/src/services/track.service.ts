import { Track } from "@/types/mappack.types";
import { authenticatedFetch } from "./api";
import axios from "axios";
import { API_BASE } from "@/constants/miscellaneous";

interface AddTrackToMappackParams {
  mappackId: string;
  trackId: string;
  tmxId: string;
}

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

  fetchPlayerRecords: async (
    trackId: string,
    playerId: string,
  ): Promise<void> => {
    const response = await axios.post(
      `${API_BASE}/tracks/${trackId}/records/${playerId}/fetch`,
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch records");
    }
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
