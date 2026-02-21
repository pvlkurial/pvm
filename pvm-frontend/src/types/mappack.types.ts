export interface TimeGoal {
  id?: number;
  name: string;
  mappack_id: string;
  multiplier: number;
}
export interface MappackTier {
  id?: number;
  mappack_id: string;
  name: string;
  points: number;
  color: string;
}

export interface MappackRank {
  id?: number;
  mappack_id: string;
  name: string;
  pointsNeeded: number;
  color: string;
  
  backgroundGlow: boolean;
  invertedColor: boolean;
  textShadow: boolean;
  glowIntensity: number;
  borderWidth: number;
  borderColor?: string | null;
  
  symbolsAround?: string | null;
  animationType: string;
  cardStyle: string;
  backgroundPattern: string;
  
  fontSize: string;
  fontWeight: string;
}

export interface TimeGoalMappackTrack {
  track_id: string;
  mappack_id: string;
  time_goal_id: number;
  time: number;
  is_achieved?: boolean;
  player_time?: number;
}

export interface MappackTrack {
  mappack_id: string;
  track_id: string;
  track: Track;
  timeGoalMappackTrack: TimeGoalMappackTrack[];
  tier_id: number | null;
  tier: MappackTier | null;
  mapStyle: string | null;
  personal_best?: number;
}

export interface Mappack {
  id: string;
  name: string;
  description: string;
  thumbnailURL: string;
  isActive: boolean;
  MappackTrack: MappackTrack[];
  timeGoals: TimeGoal[];
  mappackTiers: MappackTier[];
  mappackRanks: MappackRank[];
  mapStyleName: string;
}

export interface Track {
  id: string;
  mapId: string;
  mapUid: string;
  tmxId: string;
  name: string;
  author: string;
  authorName: string;
  submitter: string;
  authorScore: number;
  goldScore: number;
  silverScore: number;
  bronzeScore: number;
  collectionName: string;
  filename: string;
  mapType: string;
  mapStyle: string;
  isPlayable: boolean;
  createdWithGamepadEditor: boolean;
  createdWithSimpleEditor: boolean;
  timestamp: string;
  fileUrl: string;
  thumbnailUrl: string;
  time: number;
  tier: MappackTier;
  updatedAt: string;
  records: Record[];
  timegoals: Array<{
    name: string;
    time: number;
    multiplier: number;
  }>;
  dominantColor: string;
  personalBest?: number;
}

export interface Record {
  mapRecordId: string;
  score: number;
  updatedAt: string;
  zoneName: string;
  position: number;
  timestamp: number;
  player: {
    ID: string;
    name: string;
  };
}

export interface PlayerLeaderboardEntry {
  entry: {
    player_id: string;
    mappack_id: string;
    total_points: number;
    achievements_count: number;
    best_achievements_count: number;
    last_updated: string;
    player: {
      ID: string;
      name: string;
      Records: any;
    };
  };
  rank: number;
}