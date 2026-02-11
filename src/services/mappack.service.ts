import axios from 'axios';
import { Mappack } from '@/types/mappack.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const mappackService = {
  getMappack: async (mappackId: string, playerId?: string): Promise<Mappack> => {
    const url = playerId 
      ? `${API_BASE}/mappacks/${mappackId}?player_id=${playerId}`
      : `${API_BASE}/mappacks/${mappackId}`;
    
    const response = await axios.get<Mappack>(url);
    return response.data;
  },

};