package logger

import (
	"log/slog"
	"os"
)

func Init() {
	env := os.Getenv("ENV")

	var handler slog.Handler
	opts := &slog.HandlerOptions{
		Level:     resolveLevel(),
		AddSource: env == "production",
	}

	if env == "production" {
		handler = slog.NewJSONHandler(os.Stdout, opts)
	} else {
		handler = slog.NewTextHandler(os.Stdout, opts)
	}

	slog.SetDefault(slog.New(handler))
}

func resolveLevel() slog.Level {
	switch os.Getenv("LOG_LEVEL") {
	case "debug":
		return slog.LevelDebug
	case "warn":
		return slog.LevelWarn
	case "error":
		return slog.LevelError
	default:
		return slog.LevelInfo
	}
}
