import { Mappack } from '@/types/mappack.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const mappackEditService = {
  updateMappack: async (mappack: Mappack): Promise<void> => {
    const payload = {
      id: mappack.id,
      name: mappack.name,
      description: mappack.description,
      thumbnailURL: mappack.thumbnailURL,
      isActive: mappack.isActive,
      timeGoals: mappack.timeGoals.map((tg) => ({
        id: tg.id,
        name: tg.name,
        mappack_id: mappack.id,
        multiplier: tg.multiplier,
      })),
      mappackTiers: mappack.mappackTiers.map((tier) => ({
        id: tier.id,
        name: tier.name,
        mappack_id: mappack.id,
        points: tier.points,
        color: tier.color,
      })),
      mappackRanks: mappack.mappackRanks.map((rank) => ({
        id: rank.id,
        name: rank.name,
        mappack_id: mappack.id,
        pointsNeeded: rank.pointsNeeded,
        color: rank.color,
        backgroundGlow: rank.backgroundGlow,
        invertedColor: rank.invertedColor,
        textShadow: rank.textShadow,
        glowIntensity: rank.glowIntensity,
        borderWidth: rank.borderWidth,
        borderColor: rank.borderColor,
        symbolsAround: rank.symbolsAround,
        animationType: rank.animationType,
        cardStyle: rank.cardStyle,
        backgroundPattern: rank.backgroundPattern,
        fontSize: rank.fontSize,
        fontWeight: rank.fontWeight,
      })),
      MappackTrack: mappack.MappackTrack.map((track) => ({
        mappack_id: track.mappack_id,
        track_id: track.track_id,
        tier_id: track.tier_id,
        mapStyle: track.mapStyle,
        timeGoalMappackTrack: track.timeGoalMappackTrack.map((tg) => ({
          track_id: track.track_id,
          mappack_id: mappack.id,
          time_goal_id: tg.time_goal_id,
          time: tg.time,
        })),
      })),
    };

    const response = await fetch(`${API_BASE}/mappacks`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update mappack: ${errorText}`);
    }
  },

  deleteTimeGoal: async (mappackId: string, timeGoalId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE}/mappacks/${mappackId}/timegoals/${timeGoalId}`,
      { method: "DELETE" }
    );
    if (!response.ok) throw new Error("Failed to delete time goal");
  },

  deleteTier: async (mappackId: string, tierId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE}/mappacks/${mappackId}/tiers/${tierId}`,
      { method: "DELETE" }
    );
    if (!response.ok) throw new Error("Failed to delete tier");
  },

  deleteRank: async (mappackId: string, rankId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE}/mappacks/${mappackId}/ranks/${rankId}`,
      { method: "DELETE" }
    );
    if (!response.ok) throw new Error("Failed to delete rank");
  },

  deleteTrack: async (mappackId: string, trackId: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE}/mappacks/${mappackId}/tracks/${trackId}`,
      { method: "DELETE" }
    );
    if (!response.ok) throw new Error("Failed to delete track");
  },
};