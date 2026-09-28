import axios from "axios";
import { API_BASE } from "@/constants/miscellaneous";
import { PlayerProfile, RecentAchievement } from "@/types/player.types";

export const playerService = {
  getProfile: async (playerId: string): Promise<PlayerProfile> => {
    const response = await axios.get<PlayerProfile>(`${API_BASE}/players/${playerId}/profile`);
    return response.data;
  },

  getRecentAchievements: async (
    playerId: string,
    limit: number,
    offset: number,
  ): Promise<RecentAchievement[]> => {
    const response = await axios.get<RecentAchievement[]>(
      `${API_BASE}/players/${playerId}/achievements`,
      { params: { limit, offset } },
    );
    return response.data ?? [];
  },
};
