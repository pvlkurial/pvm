"use client";
import { useState } from "react";
import { FiBarChart2 } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AccentPicker,
  CopyUrlFooter,
  Setting,
  siteOrigin,
} from "@/components/overlay/OverlaySettingParts";

/** Settings and URL for the mappack stats overlay (points, rank, progress). */
export function StatsOverlayControls({ mappackId }: { mappackId: string }) {
  const { user } = useAuth();
  const [opacity, setOpacity] = useState(75);
  const [accent, setAccent] = useState("base");

  const playerParam = user?.id ? `&playerId=${user.id}` : "";
  const url = `${siteOrigin()}/stats/${mappackId}?opacity=${opacity}&accent=${accent}${playerParam}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Copy stats overlay URL"
          className="cursor-pointer text-faint transition-colors hover:text-muted-foreground"
        >
          <FiBarChart2 size={12} />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">Stats Overlay</h2>

          <Setting label={`Background Opacity - ${opacity}%`}>
            <Slider step={5} min={0} max={100} value={[opacity]} onValueChange={([v]) => setOpacity(v)} />
          </Setting>

          <Setting label="Accent Color">
            <AccentPicker value={accent} onChange={setAccent} />
          </Setting>

          <CopyUrlFooter label="Copy Stats URL" url={url} sizeHint="Set width 440, height 100." />
        </div>
      </PopoverContent>
    </Popover>
  );
}
