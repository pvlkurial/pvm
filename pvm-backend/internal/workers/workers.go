package workers

import (
	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/services"
)

type workers struct {
	NadeoWorker NadeoWorker
}

func NewWorkers(services services.Services, nadeoClient clients.NadeoAPIClient) *workers {
	nadeoWorker := NewNadeoWorker(services.RecordService, services.TracksService, nadeoClient)
	return &workers{
		NadeoWorker: nadeoWorker,
	}
}
