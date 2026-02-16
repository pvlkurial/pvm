export interface TmxTrack {
  TrackID: number;
  MapUUID: string;
  Name: string;
  AuthorName: string;
  ThumbnailURL: string;
}

export interface TmxSearchResponse {
  results: TmxTrack[];
}