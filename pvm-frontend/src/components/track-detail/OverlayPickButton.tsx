"use client";
import { LuMonitor, LuMonitorCheck } from "react-icons/lu";
import { Track } from "@/types/mappack.types";
import { useOverlaySelection } from "@/hooks/useOverlaySelection";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { OverlaySettings } from "./OverlaySettings";

interface OverlayPickButtonProps {
  mappackId: string;
  track: Track;
}

/**
 * One click makes this track the one the player's OBS overlay shows; hovering
 * opens the overlay's settings and its URL below the button. Only rendered
 * when signed in, since the selection belongs to the account.
 */
export function OverlayPickButton({ mappackId, track }: OverlayPickButtonProps) {
  const { isSignedIn, playerId, selection, saving, selectTrack, selectGoal } =
    useOverlaySelection();
  if (!isSignedIn || !playerId) return null;

  const isSelected = selection?.mappack_id === mappackId && selection?.track_id === track.id;
  const label = isSelected ? "Shown in your OBS overlay" : "Show in your OBS overlay";

  return (
    <HoverCard openDelay={150} closeDelay={250}>
      <HoverCardTrigger asChild>
        <Button
          variant={isSelected ? "default" : "outline"}
          size="icon"
          aria-label={label}
          aria-pressed={isSelected}
          title={label}
          disabled={saving}
          onClick={() => !isSelected && selectTrack(mappackId, track.id)}
        >
          {isSelected ? <LuMonitorCheck className="size-4" /> : <LuMonitor className="size-4" />}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="bottom">
        <OverlaySettings
          track={track}
          playerId={playerId}
          goal={selection?.goal}
          onGoalChange={selectGoal}
          saving={saving}
        />
      </HoverCardContent>
    </HoverCard>
  );
}
