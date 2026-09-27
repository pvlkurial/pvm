import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { overlayService, OverlaySelection } from "@/services/overlay.service";

/** The signed-in user's OBS overlay selection, and ways to change it. */
export function useOverlaySelection() {
  const { user } = useAuth();
  const [selection, setSelection] = useState<OverlaySelection | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    overlayService
      .get(user.id)
      .then((result) => !cancelled && setSelection(result))
      .catch((error) => console.error("Error loading overlay selection:", error));
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const save = async (request: () => Promise<OverlaySelection>) => {
    setSaving(true);
    try {
      setSelection(await request());
    } catch (error) {
      console.error("Error saving overlay selection:", error);
    } finally {
      setSaving(false);
    }
  };

  return {
    isSignedIn: !!user?.id,
    playerId: user?.id,
    selection,
    saving,
    selectTrack: (mappackId: string, trackId: string) =>
      save(() => overlayService.selectTrack(mappackId, trackId)),
    selectGoal: (goal: string) => save(() => overlayService.selectGoal(goal)),
  };
}
