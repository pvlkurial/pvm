package utils

import (
	"image"
	_ "image/jpeg"
	_ "image/png"
	"net/http"
	"strings"

	"github.com/EdlinOrg/prominentcolor"
)

func GetDistinctiveColor(imageURL string) (string, error) {
	resp, err := http.Get(imageURL)
	if err != nil {
		return "000000", err
	}
	defer resp.Body.Close()
	img, _, err := image.Decode(resp.Body)
	if err != nil {
		return "000000", err
	}
	colors, err := prominentcolor.Kmeans(img)
	if err != nil {
		return "000000", err
	}
	if len(colors) == 0 {
		return "000000", nil
	}
	colorIndex := 0
	if len(colors) > 1 {
		colorIndex = 1
	}

	colorHex := colors[colorIndex].AsString()
	return strings.TrimPrefix(colorHex, "#"), nil
}
