package dtos

type PlayerSearchResult struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	TotalPoints int    `json:"total_points"`
	Rank        *int   `json:"rank,omitempty"`
}
