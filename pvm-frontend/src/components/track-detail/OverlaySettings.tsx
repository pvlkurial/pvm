"use client";
import { useState } from "react";
import { Track } from "@/types/mappack.types";
import { findGoalByName, getGoalsWithWorldRecord } from "@/utils/track.utils";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  AccentPicker,
  CopyUrlFooter,
  Setting,
  siteOrigin,
} from "@/components/overlay/OverlaySettingParts";

type Side = "left" | "right";

interface OverlaySettingsProps {
  track: Track;
  playerId: string;
  /** The saved goal's name; the goal applies to whichever map is selected. */
  goal?: string;
  onGoalChange: (goal: string) => void;
  saving: boolean;
}

/**
 * Settings for the player's OBS overlay. The goal is saved to the account; the
 * look (side, opacity, accent) is baked into the copied URL.
 */
export function OverlaySettings({
  track,
  playerId,
  goal,
  onGoalChange,
  saving,
}: OverlaySettingsProps) {
  const [side, setSide] = useState<Side>("right");
  const [opacity, setOpacity] = useState(75);
  const [accent, setAccent] = useState("base");

  const goals = getGoalsWithWorldRecord(track);
  const selectedGoal = findGoalByName(track, goal)?.name ?? "";
  const url = `${siteOrigin()}/overlay?player=${playerId}&side=${side}&opacity=${opacity}&accent=${accent}`;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-2xl">OBS Overlay</h2>

      {goals.length > 0 ? (
        <Setting label="Time Goal">
          <RadioGroup value={selectedGoal} onValueChange={onGoalChange} disabled={saving}>
            {goals.map((option) => (
              <label
                key={option.name}
                className="flex cursor-pointer items-center gap-2 text-small text-foreground"
              >
                <RadioGroupItem value={option.name} />
                {option.name}
              </label>
            ))}
          </RadioGroup>
        </Setting>
      ) : (
        <p className="text-small text-faint">No goals defined</p>
      )}

      <hr className="border-border-subtle" />

      <Setting label="Text Side">
        <div className="flex gap-1 rounded-full bg-surface-2 p-1">
          {(["left", "right"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSide(option)}
              className={cn(
                "h-7 flex-1 cursor-pointer rounded-full text-small capitalize transition-colors",
                side === option
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </Setting>

      <Setting label={`Background Opacity - ${opacity}%`}>
        <Slider step={5} min={0} max={100} value={[opacity]} onValueChange={([v]) => setOpacity(v)} />
      </Setting>

      <Setting label="Accent Color">
        <AccentPicker value={accent} onChange={setAccent} />
      </Setting>

      <CopyUrlFooter label="Copy OBS URL" url={url} sizeHint="Set width 460, height 120." />
    </div>
  );
}
