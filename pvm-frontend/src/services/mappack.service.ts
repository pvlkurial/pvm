import axios from "axios";
import {
  Mappack,
  PlayerLeaderboardEntry,
  LeaderboardEntry,
} from "@/types/mappack.types";
import { API_BASE } from "@/constants/miscellaneous";

export const mappackService = {
  getMappack: async (
    mappackId: string,
    playerId?: string,
  ): Promise<Mappack> => {
    const url = playerId
      ? `${API_BASE}/mappacks/${mappackId}?player_id=${playerId}`
      : `${API_BASE}/mappacks/${mappackId}`;

    const response = await axios.get<Mappack>(url);
    return response.data;
  },
  getLeaderboard: async (
    mappackId: string,
    limit: number,
    offset: number,
  ): Promise<LeaderboardEntry[]> => {
    const response = await fetch(
      `${API_BASE}/mappacks/${mappackId}/leaderboard?limit=${limit}&offset=${offset}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to load leaderboard: ${response.statusText}`);
    }
    return response.json();
  },

  getPlayerLeaderboardEntry: async (
    mappackId: string,
    playerId: string,
  ): Promise<PlayerLeaderboardEntry> => {
    const response = await axios.get<PlayerLeaderboardEntry>(
      `${API_BASE}/mappacks/${mappackId}/players/${playerId}/leaderboard-entry`,
    );
    return response.data;
  },
};
