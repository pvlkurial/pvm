import { Track } from '@/types/mappack.types';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface AddTrackToMappackParams {
  mappackId: string;
  trackId: string;
  tierId: number | null;
  mapStyle: string;
}

interface TimeGoalValue {
  time_goal_id: number;
  time: number;
}

export const trackService = {
  addToMappack: async ({ mappackId, trackId, tierId, mapStyle }: AddTrackToMappackParams): Promise<void> => {
    await axios.post(`${API_BASE}/mappacks/${mappackId}/tracks/${trackId}`, {
      tier_id: tierId,
      mapStyle: mapStyle,
    });
  },

  addTimeGoals: async (
    mappackId: string, 
    trackId: string, 
    timeGoals: TimeGoalValue[]
  ): Promise<void> => {
    if (timeGoals.length === 0) return;
    
    await axios.patch(
      `${API_BASE}/mappacks/${mappackId}/tracks/${trackId}/timegoals`,
      timeGoals
    );
  },

    getTrackDetails: async (mappackId: string, trackId: string, playerId?: string): Promise<Track> => {
    const url = playerId 
      ? `${API_BASE}/mappacks/${mappackId}/tracks/${trackId}?player_id=${playerId}`
      : `${API_BASE}/mappacks/${mappackId}/tracks/${trackId}`;
    
    const response = await axios.get<Track>(url);
    return response.data;
  },

  fetchPlayerRecords: async (trackId: string, playerId: string): Promise<void> => {
    const response = await axios.post(
      `${API_BASE}/tracks/${trackId}/records/${playerId}/fetch`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch records");
    }
  },

  // FETCH TRACKS RIGHT AFTER ADDING A NEW TRACK
  // fetchRecords: async (trackId: string): Promise<void> => {
  //   await axios.post(`${API_BASE}/tracks/${trackId}/records`);
  // },
}