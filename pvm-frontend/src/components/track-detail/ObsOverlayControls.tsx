"use client";
import { useState } from "react";
import { FiMonitor, FiCheck, FiBarChart2 } from "react-icons/fi";
import { Track } from "@/types/mappack.types";
import { useAuth } from "@/contexts/AuthContext";
import { getGoalsWithWorldRecord } from "@/utils/track.utils";
import { copyToClipboard } from "@/utils/clipboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ACCENT_PRESETS = [
  { label: "Base", value: "base" },
  { label: "Green", value: "4ade80" },
  { label: "Blue", value: "60a5fa" },
  { label: "Purple", value: "c084fc" },
  { label: "Orange", value: "fb923c" },
  { label: "White", value: "ffffff" },
];

const COPIED_FEEDBACK_MS = 1500;
const FALLBACK_ORIGIN = "https://pvms.club";

type Side = "left" | "right";

function siteOrigin(): string {
  return typeof window !== "undefined" ? window.location.origin : FALLBACK_ORIGIN;
}

function Setting({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function AccentPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ACCENT_PRESETS.map((preset) => (
        <button
          key={preset.value}
          type="button"
          onClick={() => onChange(preset.value)}
          title={preset.label}
          aria-label={preset.label}
          aria-pressed={value === preset.value}
          style={
            preset.value === "base"
              ? { background: "conic-gradient(#4ade80, #60a5fa, #c084fc, #fb923c, #4ade80)" }
              : { background: `#${preset.value}` }
          }
          className={cn(
            "size-6 cursor-pointer rounded-full transition-transform",
            value === preset.value
              ? "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-popover"
              : "opacity-60 hover:opacity-100",
          )}
        />
      ))}
    </div>
  );
}

interface OverlayPopoverProps {
  title: string;
  icon: React.ReactNode;
  triggerLabel: string;
  isCopied: boolean;
  onCopy: () => void;
  copyLabel: string;
  sizeHint: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

/** A settings popover that ends in a "copy URL" button for an OBS browser source. */
function OverlayPopover({
  title,
  icon,
  triggerLabel,
  isCopied,
  onCopy,
  copyLabel,
  sizeHint,
  open,
  onOpenChange,
  children,
}: OverlayPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={triggerLabel}
          className="cursor-pointer text-faint transition-colors hover:text-muted-foreground"
        >
          {icon}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{title}</h2>

          {children}

          <hr className="border-border-subtle" />

          <Button size="sm" variant="outline" className="w-full" onClick={onCopy}>
            {copyLabel}
            {isCopied && <FiCheck className="size-3.5" />}
          </Button>

          <p className="text-center text-small text-faint">
            Paste as Browser Source in OBS.
            <br />
            {sizeHint}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface ObsOverlayControlsProps {
  track: Track;
  mappackId: string;
}

export function ObsOverlayControls({ track, mappackId }: ObsOverlayControlsProps) {
  const { user } = useAuth();
  const playerParam = user?.id ? `&playerId=${user.id}` : "";
  const goals = getGoalsWithWorldRecord(track);

  const [copied, setCopied] = useState<"overlay" | "stats" | null>(null);

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("0");
  const [side, setSide] = useState<Side>("right");
  const [opacity, setOpacity] = useState(75);
  const [accent, setAccent] = useState("base");

  const [statsOpen, setStatsOpen] = useState(false);
  const [statsOpacity, setStatsOpacity] = useState(75);
  const [statsAccent, setStatsAccent] = useState("base");

  const copyAndClose = async (
    which: "overlay" | "stats",
    url: string,
    close: () => void,
  ) => {
    await copyToClipboard(url);
    setCopied(which);
    setTimeout(() => {
      setCopied(null);
      close();
    }, COPIED_FEEDBACK_MS);
  };

  const handleCopyOverlay = () =>
    copyAndClose(
      "overlay",
      `${siteOrigin()}/overlay/${mappackId}/${track.id}?goalIndex=${selectedIndex}&side=${side}&opacity=${opacity}&accent=${accent}${playerParam}`,
      () => setOverlayOpen(false),
    );

  const handleCopyStats = () =>
    copyAndClose(
      "stats",
      `${siteOrigin()}/stats/${mappackId}?opacity=${statsOpacity}&accent=${statsAccent}${playerParam}`,
      () => setStatsOpen(false),
    );

  return (
    <div className="flex items-center gap-1.5">
      <OverlayPopover
        title="OBS Overlay"
        icon={<FiMonitor size={14} />}
        triggerLabel="Generate OBS overlay"
        isCopied={copied === "overlay"}
        onCopy={handleCopyOverlay}
        copyLabel="Copy OBS URL"
        sizeHint="Set width 460, height 120."
        open={overlayOpen}
        onOpenChange={setOverlayOpen}
      >
        {goals.length > 0 ? (
          <Setting label="Time Goal">
            <RadioGroup value={selectedIndex} onValueChange={setSelectedIndex}>
              {goals.map((goal, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer items-center gap-2 text-small text-foreground"
                >
                  <RadioGroupItem value={String(i)} />
                  {goal.name}
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
            {(["left", "right"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={cn(
                  "h-7 flex-1 cursor-pointer rounded-full text-small capitalize transition-colors",
                  side === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </Setting>

        <Setting label={`Background Opacity - ${opacity}%`}>
          <Slider
            step={5}
            min={0}
            max={100}
            value={[opacity]}
            onValueChange={([v]) => setOpacity(v)}
          />
        </Setting>

        <Setting label="Accent Color">
          <AccentPicker value={accent} onChange={setAccent} />
        </Setting>
      </OverlayPopover>

      <OverlayPopover
        title="Stats Overlay"
        icon={
          copied === "stats" ? <FiCheck size={12} /> : <FiBarChart2 size={12} />
        }
        triggerLabel="Copy stats overlay URL"
        isCopied={copied === "stats"}
        onCopy={handleCopyStats}
        copyLabel="Copy Stats URL"
        sizeHint="Set width 440, height 100."
        open={statsOpen}
        onOpenChange={setStatsOpen}
      >
        <Setting label={`Background Opacity - ${statsOpacity}%`}>
          <Slider
            step={5}
            min={0}
            max={100}
            value={[statsOpacity]}
            onValueChange={([v]) => setStatsOpacity(v)}
          />
        </Setting>

        <Setting label="Accent Color">
          <AccentPicker value={statsAccent} onChange={setStatsAccent} />
        </Setting>
      </OverlayPopover>
    </div>
  );
}
