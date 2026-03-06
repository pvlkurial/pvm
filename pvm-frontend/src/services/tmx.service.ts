import { TmxTrack, TmxSearchResponse } from "@/types/tmx.types";
import { API_BASE } from "@/constants/miscellaneous";

class TmxService {
  async searchTracks(query: string): Promise<TmxTrack[]> {
    try {
      const response = await fetch(
        `${API_BASE}/tmx/search?name=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to search tracks");
      }

      const data: TmxSearchResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("TMX search error:", error);
      throw error;
    }
  }
}

export const tmxService = new TmxService();
