package main

import (
	"example/pvm-backend/internal/api"
	"example/pvm-backend/internal/database"
	"example/pvm-backend/internal/utils/logger"

	"github.com/gin-gonic/gin"
)

func main() {

	logger.Init()

	router := gin.Default()
	db := database.ConnectDatabase()
	database.MigrateDatabase(db)
	database.SeedDatabase(db)
	r := api.Routes{router, db}
	r.InitRoutes()
}
