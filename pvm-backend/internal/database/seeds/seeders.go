package seeds

import "gorm.io/gorm"

type Seeders struct {
	MappackSeeder MappackSeeder
	PlayerSeeder  PlayerSeeder
}

func NewSeeders(DB *gorm.DB) *Seeders {
	return &Seeders{
		MappackSeeder: MappackSeeder{DB: DB},
		PlayerSeeder:  PlayerSeeder{DB: DB},
	}
}

func (s *Seeders) SeedAll() error {
	if err := s.PlayerSeeder.seedPlayers(); err != nil {
		return err
	}
	if err := s.MappackSeeder.seedMappacks(); err != nil {
		return err
	}
	return nil
}
