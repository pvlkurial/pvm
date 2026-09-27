"use client";
import { useState } from "react";
import { FaSync } from "react-icons/fa";
import { canRefreshRecords } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";
import { trackService } from "@/services/track.service";
import { useCooldown } from "@/hooks/useCooldown";
import { formatSecondsToMMSS } from "@/utils/time.utils";
import { Button } from "@/components/ui/button";

/** Matches the backend's limit. The server enforces it; this just shows it. */
const COOLDOWN_SECONDS = 60;
/** One cooldown for every track, like the backend's. */
const COOLDOWN_KEY = "record-refresh-cooldown";
const NOTICE_MS = 4000;

interface UpdateRecordsButtonProps {
  trackId: string;
  onSuccess?: () => void;
}

/**
 * Refreshes the signed-in user's own record on this track. Only shown to
 * superadmins and Patreon supporters.
 */
export function UpdateRecordsButton({ trackId, onSuccess }: UpdateRecordsButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const { isOnCooldown, secondsLeft, startCooldown } = useCooldown(COOLDOWN_KEY, COOLDOWN_SECONDS);

  if (!canRefreshRecords(user)) return null;

  const showNotice = (text: string) => {
    setNotice(text);
    setTimeout(() => setNotice(null), NOTICE_MS);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const result = await trackService.refreshOwnRecord(trackId);
      if (result.status === "cooldown") {
        startCooldown(result.retryAfterSeconds);
        return;
      }
      startCooldown();
      if (result.status === "no-record") {
        showNotice("No record of yours on this track");
        return;
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error refreshing record:", error);
      showNotice("Couldn't refresh, try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleUpdate}
        loading={isLoading}
        disabled={isOnCooldown}
        title="Fetch your latest record on this track"
      >
        {!isLoading && <FaSync className="size-3.5" />}
        {isOnCooldown
          ? formatSecondsToMMSS(secondsLeft)
          : isLoading
            ? "Updating..."
            : "Update my record"}
      </Button>
      {notice && <span className="text-small text-muted-foreground">{notice}</span>}
    </div>
  );
}
