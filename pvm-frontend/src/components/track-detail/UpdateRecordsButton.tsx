"use client";
import { useState } from "react";
import { FaSync } from "react-icons/fa";
import { trackService } from "@/services/track.service";
import { useCooldown } from "@/hooks/useCooldown";
import { formatSecondsToMMSS } from "@/utils/time.utils";
import { Button } from "@/components/ui/button";

const COOLDOWN_SECONDS = 300;

interface UpdateRecordsButtonProps {
  trackId: string;
  playerId: string;
  onSuccess?: () => void;
}

export function UpdateRecordsButton({
  trackId,
  playerId,
  onSuccess,
}: UpdateRecordsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOnCooldown, secondsLeft, startCooldown } = useCooldown(
    `record-update-cooldown-${trackId}-${playerId}`,
    COOLDOWN_SECONDS,
  );

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await trackService.fetchPlayerRecords(trackId, playerId);
      startCooldown();
      onSuccess?.();
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleUpdate}
      loading={isLoading}
      disabled={isOnCooldown}
    >
      {!isLoading && <FaSync className="size-3.5" />}
      {isOnCooldown
        ? formatSecondsToMMSS(secondsLeft)
        : isLoading
          ? "Updating..."
          : "Update"}
    </Button>
  );
}
