import axios from "axios";
import {
  Mappack,
  MappackType,
  PlayerLeaderboardEntry,
  LeaderboardEntry,
} from "@/types/mappack.types";
import { API_BASE } from "@/constants/miscellaneous";

export interface CreateMappackPayload {
  id: string;
  name: string;
  description: string;
  thumbnailURL: string;
  isActive: boolean;
  type: MappackType;
  featured: boolean;
  isNew: boolean;
  mapStyleName: string;
}

export const mappackService = {
  listMappacks: async (): Promise<Mappack[]> => {
    const response = await axios.get<Mappack[]>(`${API_BASE}/mappacks`);
    return response.data ?? [];
  },

  /** Campaigns come from their own endpoint so the two listings never mix. */
  listCampaigns: async (): Promise<Mappack[]> => {
    const response = await axios.get<Mappack[]>(`${API_BASE}/campaigns`);
    return response.data ?? [];
  },

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

  createMappack: async (mappack: CreateMappackPayload): Promise<void> => {
    await axios.post(`${API_BASE}/mappacks`, mappack);
  },

  createTimeGoal: async (
    mappackId: string,
    timeGoal: { name: string; difficulty: number },
  ): Promise<void> => {
    await axios.post(`${API_BASE}/mappacks/${mappackId}/timegoals`, {
      ...timeGoal,
      mappack_id: mappackId,
    });
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

  searchPlayers: async (
    mappackId: string,
    query: string,
    limit: number,
  ): Promise<PlayerSearchResult[]> => {
    const response = await axios.get<PlayerSearchResult[]>(
      `${API_BASE}/mappacks/${mappackId}/players/search`,
      { params: { q: query, limit } },
    );
    return response.data || [];
  },
};

export interface PlayerSearchResult {
  id: string;
  name: string;
  total_points: number;
  rank?: number;
}
