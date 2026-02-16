import { TmxTrack, TmxSearchResponse } from "@/types/tmx.types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class TmxService {
  async searchTracks(query: string): Promise<TmxTrack[]> {
    try {
      const response = await fetch(
        `${API_BASE}/tmx/search?name=${encodeURIComponent(query)}`
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