package services

import (
	"example/pvm-backend/internal/clients"
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/models/dtos"
	"example/pvm-backend/internal/repositories"
	"fmt"
	"time"
)

type RecordService interface {
	Create(record *models.Record) error
	GetById(id string) (models.Record, error)
	GetByTrackId(id string) ([]models.Record, error)
	GetPlayersRecordsForTrack(trackId string, playerId string) ([]models.Record, error)
	SaveFetchedRecords(records *[]models.Record) error
	GetTrackWithRecords(mappackId string, trackId string, playerID *string) (dtos.TrackInMappackDto, error)
}

type recordService struct {
	recordRepository   repositories.RecordRepository
	playerRepository   repositories.PlayerRepository
	trackRepository    repositories.TrackRepository
	trackmaniaClient   clients.TrackmaniaAPIClient
	achievementService *AchievementService
}

func NewRecordService(recordRepo repositories.RecordRepository,
	playerRepo repositories.PlayerRepository,
	trackRepo repositories.TrackRepository,
	trackmaniaClient clients.TrackmaniaAPIClient,
	achievementService *AchievementService) RecordService {
	return &recordService{
		recordRepository:   recordRepo,
		playerRepository:   playerRepo,
		trackRepository:    trackRepo,
		achievementService: achievementService,
		trackmaniaClient:   trackmaniaClient}
}

func (t *recordService) Create(record *models.Record) error {
	return t.recordRepository.Create(record)
}

func (t *recordService) GetById(id string) (models.Record, error) {
	return t.recordRepository.GetById(id)
}

func (t *recordService) GetByTrackId(id string) ([]models.Record, error) {
	return t.recordRepository.GetByTrackId(id)
}

func (t *recordService) GetPlayersRecordsForTrack(trackId string, playerId string) ([]models.Record, error) {
	return t.recordRepository.GetPlayersRecordsForTrack(trackId, playerId)
}

func (t *recordService) SaveFetchedRecords(records *[]models.Record) error {
	if records == nil || len(*records) == 0 {
		return nil
	}

	nonFoundPlayers := make([]string, 0)
	foundTrack, err := t.trackRepository.GetById((*records)[0].TrackID)
	if err != nil {
		return fmt.Errorf("error fetching track %s: %w", (*records)[0].TrackID, err)
	}
	_, err = t.playerRepository.GetById(foundTrack.Author)
	if err != nil {
		nonFoundPlayers = append(nonFoundPlayers, foundTrack.Author)
	}

	for _, record := range *records {
		_, err := t.playerRepository.GetById(record.PlayerID)
		if err != nil {
			fmt.Printf("Player %s not found.\n", record.PlayerID)
			nonFoundPlayers = append(nonFoundPlayers, record.PlayerID)
		}
	}
	if len(nonFoundPlayers) > 0 {
		players, err := t.trackmaniaClient.FetchPlayerNames(nonFoundPlayers)
		if err != nil {
			return fmt.Errorf("error fetching player names: %w", err)
		}
		if len(players) > 0 {
			err = t.playerRepository.UpdatePlayersDisplayNames(&players)
			if err != nil {
				return fmt.Errorf("error creating players: %w", err)
			}
			fmt.Printf("Created/updated %d players.\n", len(players))
		}
		foundTrack.AuthorName = players[0].Name
	}

	personalBests := make([]models.Record, 0)

	for _, record := range *records {

		fmt.Printf("Record saved. Checking if PB for player %s on track %s with time %d\n",
			record.PlayerID, record.TrackID, record.RecordTime)

		isPB, err := t.isPersonalBest(record.PlayerID, record.TrackID, record.RecordTime)
		if err != nil {
			fmt.Printf("Error checking if personal best: %v\n", err)
			continue
		}
		err = t.recordRepository.Create(&record)
		if err != nil {
			fmt.Printf("Error creating record for player %s: %v\n", record.PlayerID, err)
			continue
		}

		fmt.Printf("Is personal best: %v\n", isPB)

		if isPB {
			personalBests = append(personalBests, record)
			fmt.Printf("Added to personal bests list\n")
		}
	}

	fmt.Printf("Found %d personal bests\n", len(personalBests))

	if len(personalBests) > 0 {
		t.checkAchievementsForRecords(personalBests)
	} else {
		fmt.Printf("No personal bests to check achievements for\n")
	}

	return nil
}

func (t *recordService) GetTrackWithRecords(mappackId string, trackId string, playerID *string) (dtos.TrackInMappackDto, error) {
	emptyTrack := dtos.TrackInMappackDto{}

	trackInDb, err := t.trackRepository.GetById(trackId)
	if err != nil {
		return emptyTrack, err
	}

	records, err := t.recordRepository.GetByTrackId(trackId)
	if err != nil {
		return emptyTrack, err
	}

	mappackTrack, err := t.trackRepository.GetTrackInMappackInfo(mappackId, trackId)
	if err != nil {
		return emptyTrack, err
	}

	trackTimeGoals, err := t.recordRepository.GetTrackTimeGoalsTimes(mappackId, trackId)
	if err != nil {
		return emptyTrack, err
	}

	var playerAchievements map[int]*models.PlayerTimeGoalAchievement
	if playerID != nil && *playerID != "" {
		achievements, err := t.achievementService.GetPlayerAchievementsByTrack(*playerID, mappackId, trackId)
		if err == nil {
			playerAchievements = make(map[int]*models.PlayerTimeGoalAchievement)
			for _, ach := range achievements {
				achCopy := ach
				playerAchievements[ach.TimeGoalID] = &achCopy
			}
		}
	}

	timeGoalDtos := make([]dtos.TrackTimeGoalDto, 0, len(trackTimeGoals))
	for _, ttg := range trackTimeGoals {
		dto := dtos.TrackTimeGoalDto{
			TimeGoalID: ttg.TimegoalID,
			Name:       ttg.TimeGoal.Name,
			Time:       ttg.Time,
			IsAchieved: false,
		}

		if playerAchievements != nil {
			if ach, exists := playerAchievements[ttg.TimegoalID]; exists {
				dto.IsAchieved = true
				dto.PlayerTime = &ach.PlayerTime
			}
		}

		timeGoalDtos = append(timeGoalDtos, dto)
	}

	var tier models.MappackTier
	if mappackTrack.Tier != nil {
		tier = *mappackTrack.Tier
	} else {
		tier = models.MappackTier{
			Name: "Unranked",
		}
	}

	personalBest, err := t.recordRepository.GetPlayerBestScore(*playerID, trackId)
	if err != nil {
		personalBest = 0
	}
	authorName, _ := t.playerRepository.GetById(trackInDb.Author)

	track := dtos.TrackInMappackDto{
		ID:                       trackInDb.ID,
		MapID:                    trackInDb.MapID,
		MapUID:                   trackInDb.MapUID,
		Name:                     trackInDb.Name,
		Author:                   authorName.Name,
		Submitter:                trackInDb.Submitter,
		AuthorScore:              trackInDb.AuthorScore,
		GoldScore:                trackInDb.GoldScore,
		SilverScore:              trackInDb.SilverScore,
		BronzeScore:              trackInDb.BronzeScore,
		CollectionName:           trackInDb.CollectionName,
		Filename:                 trackInDb.Filename,
		MapType:                  trackInDb.MapType,
		MapStyle:                 trackInDb.MapStyle,
		IsPlayable:               trackInDb.IsPlayable,
		CreatedWithGamepadEditor: trackInDb.CreatedWithGamepadEditor,
		CreatedWithSimpleEditor:  trackInDb.CreatedWithSimpleEditor,
		Timestamp:                trackInDb.Timestamp,
		FileURL:                  trackInDb.FileURL,
		ThumbnailURL:             trackInDb.ThumbnailURL,
		Time:                     int(time.Now().Unix()),
		UpdatedAt:                trackInDb.UpdatedAt,
		Records:                  records,
		TimeGoals:                timeGoalDtos,
		DominantColor:            trackInDb.DominantColor,
		Tier:                     tier,
		PersonalBest:             personalBest,
	}
	return track, nil
}

func (t *recordService) checkAchievementsForRecords(records []models.Record) {
	mappackIDs, err := t.trackRepository.GetMappacksForTrack(records[0].TrackID)
	if err != nil {
		fmt.Printf("Error getting mappacks for track %s: %v\n", records[0].TrackID, err)
		return
	}

	for _, record := range records {
		for _, mappackID := range mappackIDs {
			err := t.achievementService.CheckAndUpdateAchievements(
				record.PlayerID,
				mappackID,
				record.TrackID,
				record.RecordTime,
			)
			if err != nil {
				fmt.Printf("Error checking achievements for player %s on track %s in mappack %s: %v\n",
					record.PlayerID, record.TrackID, mappackID, err)
			}
		}
	}
}
func (t *recordService) isPersonalBest(playerID, trackID string, score int) (bool, error) {
	bestScore, err := t.recordRepository.GetPlayerBestScore(playerID, trackID)
	if err != nil {
		return true, nil
	}

	return score < bestScore, nil
}
