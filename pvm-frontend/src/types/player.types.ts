import { MappackRank, MappackType } from "./mappack.types";

export interface PlayerSummary {
  id: string;
  name: string;
}

/** A player's standing in one mappack they have played. */
export interface PlayerMappackProgress {
  mappack_id: string;
  mappack_name: string;
  thumbnail_url: string;
  accent_color: string;
  map_style_name: string;
  type: MappackType;
  total_points: number;
  rank: number;
  /** Time goals achieved out of those on the tracks the player can see. */
  achieved_goals: number;
  total_goals: number;
  ranks: MappackRank[];
}

export interface PlayerProfile {
  player: PlayerSummary;
  mappacks: PlayerMappackProgress[];
}

/** The best time goal reached on a track, by the player's latest improvement there. */
export interface RecentAchievement {
  mappack_id: string;
  mappack_name: string;
  track_id: string;
  track_name: string;
  tier_name: string | null;
  tier_color: string | null;
  goal_name: string;
  player_time: number;
  achieved_at: string;
}
