import { useEffect, useState } from "react";
import axios from "axios";
import { playerService } from "@/services/player.service";
import { PlayerProfile } from "@/types/player.types";

type ProfileState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error" }
  | { status: "ready"; profile: PlayerProfile };

export function usePlayerProfile(playerId: string) {
  const [state, setState] = useState<ProfileState>({ status: "loading" });

  useEffect(() => {
    // Ignores a response that has been superseded by a newer request.
    let cancelled = false;
    setState({ status: "loading" });

    playerService
      .getProfile(playerId)
      .then((profile) => {
        if (!cancelled) setState({ status: "ready", profile });
      })
      .catch((error) => {
        if (cancelled) return;
        const notFound = axios.isAxiosError(error) && error.response?.status === 404;
        if (!notFound) console.error("Error fetching player profile:", error);
        setState({ status: notFound ? "not-found" : "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [playerId]);

  return state;
}
