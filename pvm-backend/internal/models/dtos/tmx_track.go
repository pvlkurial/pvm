package dtos

type TmxUploader struct {
	UserId int    `json:"UserId"`
	Name   string `json:"Name"`
}

type TmxTrack struct {
	MapId       int         `json:"MapId"`
	OnlineMapId string      `json:"OnlineMapId"`
	Name        string      `json:"Name"`
	Uploader    TmxUploader `json:"Uploader"`
}
