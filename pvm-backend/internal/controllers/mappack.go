package controllers

import (
	"example/pvm-backend/internal/models"
	"example/pvm-backend/internal/services"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MappackController struct {
	mappackService     services.MappackService
	achievementService *services.AchievementService
}

func NewMappackController(mappackService services.MappackService, achievementService *services.AchievementService) *MappackController {
	return &MappackController{
		mappackService:     mappackService,
		achievementService: achievementService,
	}
}

func (t *MappackController) Create(c *gin.Context) {
	mappack := models.Mappack{}

	err := c.ShouldBind(&mappack)
	if err != nil {
		fmt.Printf("Error occured while binding Mappack during creation: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	}

	err = t.mappackService.Create(&mappack)

	if err != nil {
		fmt.Printf("Error occured while creating a Mappack: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.String(http.StatusOK, "Creation Succesful")
	}
}

func (t *MappackController) GetById(c *gin.Context) {
	id := c.Param("mappack_id")
	playerID := c.Query("player_id")
	result, err := t.mappackService.GetByIdWithAchievements(id, &playerID)
	if err != nil {
		fmt.Printf("Error occured while getting a Mappack by id: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, result)
	}
}

func (t *MappackController) GetAll(c *gin.Context) {
	result, err := t.mappackService.GetAll()
	if err != nil {
		fmt.Printf("Error occured while getting Mappacks: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, result)
	}
}

func (t *MappackController) CreateMappackTimeGoal(c *gin.Context) {
	mappackId := c.Param("mappack_id")
	timegoal := models.TimeGoal{}
	err := c.ShouldBind(&timegoal)
	if err != nil {
		fmt.Printf("Error occured while binding Mappack during creation: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	}
	timegoal.MappackID = mappackId

	err = t.mappackService.CreateMappackTimeGoal(&timegoal)

	if err != nil {
		fmt.Printf("Error occured while creating a TimeGoal: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusCreated, gin.H{"message": "Creation Successful", "data": timegoal})
	}
}

func (t *MappackController) GetAllMappackTimeGoals(c *gin.Context) {
	mappackId := c.Param("mappack_id")
	result, err := t.mappackService.GetAllMappackTimeGoals(mappackId)
	if err != nil {
		fmt.Printf("Error occured while getting TimeGoals of a mappack: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.JSON(http.StatusOK, result)
	}
}

func (t *MappackController) RemoveTimeGoalFromMappack(c *gin.Context) {
	id := c.Param("timegoal_id")
	result, err := t.mappackService.RemoveTimeGoalFromMappack(id)

	if err != nil {
		fmt.Printf("Error occured while removing a Timegoal from a mappack: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	} else {
		c.String(http.StatusOK, "Removed %s timegoal from a mappack succesfully", result)
	}
}

func (t *MappackController) Update(c *gin.Context) {
	mappack := models.Mappack{}
	err := c.ShouldBind(&mappack)
	if err != nil {
		fmt.Printf("Error occured while binding Mappack during creation: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	}
	t.mappackService.Update(&mappack)

	go func() {
		log.Printf("Auto-recalculating achievements for mappack %s", mappack.ID)
		err := t.achievementService.RecalculateMappackAchievements(mappack.ID)
		if err != nil {
			log.Printf("Error recalculating achievements: %v", err)
		}
	}()

}

func (t *MappackController) UpdateMappackTimeGoals(c *gin.Context) {
	var timegoals []models.TimeGoal
	err := c.ShouldBind(&timegoals)
	if err != nil {
		fmt.Printf("Error occured while binding timegoals during update: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	}
	err = t.mappackService.UpdateMappackTimeGoals(&timegoals)
	if err != nil {
		fmt.Printf("Error occured while updating timegoals for mappack: %s", err)
		c.String(http.StatusInternalServerError, "Internal Server Error")
	}
}

func (c *MappackController) DeleteTimeGoal(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := c.mappackService.DeleteTimeGoal(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Time goal deleted"})
}

func (c *MappackController) DeleteTier(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := c.mappackService.DeleteTier(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Tier deleted"})
}

func (c *MappackController) DeleteRank(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := c.mappackService.DeleteRank(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Rank deleted"})
}
