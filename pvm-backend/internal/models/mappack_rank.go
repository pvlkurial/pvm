package models

type MappackRank struct {
	ID           int    `gorm:"primaryKey" json:"id"`
	MappackID    string `json:"mappack_id"`
	Name         string `json:"name"`
	PointsNeeded int    `json:"pointsNeeded"`
	Color        string `json:"color"`

	BackgroundGlow bool    `json:"backgroundGlow"`
	InvertedColor  bool    `json:"invertedColor"`
	TextShadow     bool    `json:"textShadow"`
	GlowIntensity  int     `json:"glowIntensity"`
	BorderWidth    int     `json:"borderWidth"`
	BorderColor    *string `json:"borderColor"`

	SymbolsAround     *string `json:"symbolsAround"`
	AnimationType     string  `json:"animationType"`
	CardStyle         string  `json:"cardStyle"`
	BackgroundPattern string  `json:"backgroundPattern"`

	FontSize   string `json:"fontSize"`
	FontWeight string `json:"fontWeight"`
}
