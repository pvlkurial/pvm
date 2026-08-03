import { useState } from "react";
import { Button } from "@heroui/react";
import { FaSync } from "react-icons/fa";
import { trackService } from "@/services/track.service";
import { useCooldown } from "@/hooks/useCooldown";
import { formatSecondsToMMSS } from "@/utils/time.utils";
import { ADMIN_BUTTON } from "@/constants/button-styles";

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
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const cooldownKey = `record-update-cooldown-${trackId}-${playerId}`;
  const { isOnCooldown, secondsLeft, startCooldown } = useCooldown(
    cooldownKey,
    300,
  );

  const handleUpdate = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await trackService.fetchPlayerRecords(trackId, playerId);
      startCooldown();
      setMessage({
        type: "success",
        text: "Records updated successfully!",
      });

      setTimeout(() => setMessage(null), 3000);

      onSuccess?.();
    } catch (error) {
      console.error("Error fetching records:", error);
      setMessage({
        type: "error",
        text: "Failed to update records. Please try again.",
      });

      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onPress={handleUpdate}
        isLoading={isLoading}
        isDisabled={isOnCooldown}
        startContent={
          !isLoading && <FaSync className={isOnCooldown ? "" : "w-4 h-4"} />
        }
        className={ADMIN_BUTTON}
      >
        {isOnCooldown
          ? `${formatSecondsToMMSS(secondsLeft)}`
          : isLoading
            ? "Updating..."
            : "Update"}
      </Button>
    </div>
  );
}
