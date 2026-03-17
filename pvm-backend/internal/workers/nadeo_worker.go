package workers

import (
	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/services"
	"example/pvm-backend/internal/utils/constants"
	"fmt"
	"log/slog"
	"time"
)

type NadeoWorker interface {
	Start()
}

type nadeoWorker struct {
	recordService services.RecordService
	trackService  services.TrackService
	nadeoClient   clients.NadeoAPIClient
}

func NewNadeoWorker(recordService services.RecordService,
	trackService services.TrackService, nadeoClient clients.NadeoAPIClient) NadeoWorker {
	return &nadeoWorker{recordService: recordService, trackService: trackService, nadeoClient: nadeoClient}
}

func (n *nadeoWorker) Start() {
	go func() {
		ticker := time.NewTicker(constants.FetchIntervalInHours * time.Hour)
		defer ticker.Stop()

		slog.Info("nadeo worker started", "interval_hours", constants.FetchIntervalInHours)

		for range ticker.C {
			slog.Info("nadeo worker tick: beginning record fetch cycle")

			dbTracks, err := n.trackService.GetAll()
			if err != nil {
				slog.Error("failed to get tracks", "error", err)
				continue
			}

			slog.Info("fetched tracks for processing", "count", len(dbTracks))

			for _, track := range dbTracks {
				slog.Debug("processing track", "track_id", track.ID, "map_uid", track.MapUID)

				for i := 0; i < constants.TimesOfRecordsFetchPerTrack; i++ {
					records, err := n.nadeoClient.FetchRecordsOfTrack(
						track.MapUID,
						constants.RecordsPerRequest,
						i*constants.RecordsPerRequest,
					)
					if err != nil {
						slog.Error("failed to fetch records",
							"track_id", track.ID,
							"map_uid", track.MapUID,
							"page", i,
							"error", err,
						)
						break
					}

					for j := range records {
						records[j].TrackID = track.ID
						records[j].ID = fmt.Sprintf("%s_%s", track.ID, records[j].PlayerID)
						records[j].UpdatedAt = time.Now()
					}

					if err := n.recordService.SaveFetchedRecords(&records); err != nil {
						slog.Error("failed to save fetched records",
							"track_id", track.ID,
							"page", i,
							"error", err,
						)
					}

					for _, mappackTrack := range track.MappackTrack {
						for _, record := range records {
							if err := n.trackService.SavePlayerMappackTrack(
								mappackTrack.MappackID,
								mappackTrack.TrackID,
								record.Player.ID,
								record.RecordTime,
							); err != nil {
								slog.Error("failed to save player mappack track",
									"mappack_id", mappackTrack.MappackID,
									"track_id", mappackTrack.TrackID,
									"player_id", record.Player.ID,
									"error", err,
								)
							}
						}
					}

					if len(records) < 100 {
						slog.Info("partial page received, stopping fetch for track",
							"track_id", track.ID,
							"page", i,
							"records_on_page", len(records),
						)
						time.Sleep(constants.FetchIntervalDelayInSeconds * time.Second)
						break
					}

					time.Sleep(constants.FetchIntervalDelayInSeconds * time.Second)
				}
			}

			slog.Info("nadeo worker tick: record fetch cycle complete")
		}
	}()
}
