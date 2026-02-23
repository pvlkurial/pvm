package responses

type ResponseTrack struct {
	TrackID      int    `json:"TrackID"`
	MapUUID      string `json:"MapUUID"`
	Name         string `json:"Name"`
	AuthorName   string `json:"AuthorName"`
	ThumbnailURL string `json:"ThumbnailURL"`
}
