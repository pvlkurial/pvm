package responses

import "example/pvm-backend/internal/models/dtos"

type TmxSearchResponse struct {
	More    bool            `json:"More"`
	Results []dtos.TmxTrack `json:"Results"`
}
