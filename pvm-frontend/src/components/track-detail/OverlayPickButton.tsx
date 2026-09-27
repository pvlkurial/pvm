"use client";
import { LuMonitor, LuMonitorCheck } from "react-icons/lu";
import { useOverlaySelection } from "@/hooks/useOverlaySelection";
import { Button } from "@/components/ui/button";

interface OverlayPickButtonProps {
  mappackId: string;
  trackId: string;
}

/**
 * One click makes this track the one the player's OBS overlay shows. Only
 * rendered when signed in, since the selection belongs to the account.
 */
export function OverlayPickButton({ mappackId, trackId }: OverlayPickButtonProps) {
  const { isSignedIn, selection, saving, selectTrack } = useOverlaySelection();
  if (!isSignedIn) return null;

  const isSelected = selection?.mappack_id === mappackId && selection?.track_id === trackId;
  const label = isSelected ? "Shown in your OBS overlay" : "Show in your OBS overlay";

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="icon"
      aria-label={label}
      aria-pressed={isSelected}
      title={label}
      disabled={saving}
      onClick={() => !isSelected && selectTrack(mappackId, trackId)}
    >
      {isSelected ? <LuMonitorCheck className="size-4" /> : <LuMonitor className="size-4" />}
    </Button>
  );
}
