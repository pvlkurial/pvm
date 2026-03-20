"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Button,
  Slider,
} from "@heroui/react";
import { useState } from "react";
import { Track } from "@/types/mappack.types";
import { FiMonitor, FiCheck, FiBarChart2 } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";

interface TrackCardOBSProps {
  track: Track;
  mappackId: string;
}

const ACCENT_PRESETS = [
  { label: "Base", value: "base" },
  { label: "Green", value: "4ade80" },
  { label: "Blue", value: "60a5fa" },
  { label: "Purple", value: "c084fc" },
  { label: "Orange", value: "fb923c" },
  { label: "White", value: "ffffff" },
];

export function TrackCardOBS({ track, mappackId }: TrackCardOBSProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"overlay" | "stats" | null>(null);

  const { user } = useAuth();
  const wrRecord = track.records?.length
    ? track.records.reduce((best, r) => (r.score < best.score ? r : best))
    : null;

  const goals = [
    ...[...(track.timegoals ?? [])].sort((a, b) => a.multiplier - b.multiplier),
    ...(wrRecord ? [{ name: "WR", time: wrRecord.score, multiplier: Infinity }] : []),
  ];

  const [selectedIndex, setSelectedIndex] = useState("0");
  const [side, setSide] = useState<"left" | "right">("right");
  const [opacity, setOpacity] = useState(75);
  const [accent, setAccent] = useState("base");
  const [statsOpacity, setStatsOpacity] = useState(75);
  const [statsAccent, setStatsAccent] = useState("base");
  const [statsOpen, setStatsOpen] = useState(false);

  const overlayUrl = () => {
    const base = typeof window !== "undefined" ? window.location.origin : "https://pvms.club";
    return `${base}/overlay/${mappackId}/${track.id}?goalIndex=${selectedIndex}&side=${side}&opacity=${opacity}&accent=${accent}${user?.id ? `&playerId=${user.id}` : ""}`;
  };

  const statsUrl = () => {
    const base = typeof window !== "undefined" ? window.location.origin : "https://pvms.club";
    return `${base}/stats/${mappackId}?opacity=${statsOpacity}&accent=${statsAccent}${user?.id ? `&playerId=${user.id}` : ""}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(overlayUrl());
    setCopied("overlay");
    setTimeout(() => {
      setCopied(null);
      setOpen(false);
    }, 1500);
  };

  const handleCopyStats = async () => {
    await copyToClipboard(statsUrl());
    setCopied("stats");
    setTimeout(() => {
      setCopied(null);
      setStatsOpen(false);
    }, 1500);
  };

  return (
    <div className="flex items-center gap-1.5">
      <Popover isOpen={open} onOpenChange={setOpen} placement="bottom" showArrow>
        <PopoverTrigger>
          <button
            className="text-white/20 hover:text-white/50 transition-colors"
            onClick={() => setOpen(true)}
            aria-label="Generate OBS overlay"
          >
            <FiMonitor size={14} />
          </button>
        </PopoverTrigger>

        <PopoverContent className="bg-zinc-900 border border-white/20 text-white p-4 w-64">
          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-heading text-sm">OBS Overlay</h2>

            {goals.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Time Goal</p>
                <RadioGroup value={selectedIndex} onValueChange={setSelectedIndex} size="sm">
                  {goals.map((g, i) => (
                    <Radio key={i} value={String(i)} classNames={{ label: "text-white/80 text-xs" }}>
                      {g.name}
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <p className="text-white/30 text-sm">No goals defined</p>
            )}

            <hr className="border-white/10" />

            <div className="flex flex-col gap-1.5">
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Text Side</p>
              <div className="flex gap-2">
                {(["left", "right"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSide(s)}
                    className={`flex-1 py-1 rounded text-xs font-medium transition-colors capitalize ${
                      side === s
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-white/40 text-[10px] uppercase tracking-widest">
                Background Opacity - {opacity}%
              </p>
              <Slider
                size="sm"
                step={5}
                minValue={0}
                maxValue={100}
                value={opacity}
                onChange={(v) => setOpacity(v as number)}
                classNames={{ track: "bg-white/10", filler: "bg-white/40" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Accent Color</p>
              <div className="flex gap-2 flex-wrap">
                {ACCENT_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setAccent(p.value)}
                    title={p.label}
                    style={p.value === "base"
                      ? { background: "conic-gradient(#4ade80, #60a5fa, #c084fc, #fb923c, #4ade80)" }
                      : { background: `#${p.value}` }
                    }
                    className={`w-6 h-6 rounded-full transition-transform ${
                      accent === p.value
                        ? "ring-2 ring-white scale-110"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            <hr className="border-white/10" />

            <Button
              size="sm"
              className="w-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20"
              onPress={handleCopy}
              endContent={copied === "overlay" ? <FiCheck className="text-blue-500" size={13} /> : null}
            >
              Copy OBS URL
            </Button>

            <p className="text-white/30 text-xs text-center leading-tight">
              Paste as Browser Source in OBS.
              <br />
              Set width 460, height 120.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover isOpen={statsOpen} onOpenChange={setStatsOpen} placement="bottom" showArrow>
        <PopoverTrigger>
          <button
            className="text-white/20 hover:text-white/50 transition-colors"
            aria-label="Copy stats overlay URL"
          >
            {copied === "stats" ? <FiCheck className="text-blue-500" size={12} /> : <FiBarChart2 size={12} />}
          </button>
        </PopoverTrigger>

        <PopoverContent className="bg-zinc-900 border border-white/20 text-white p-4 w-64">
          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-heading text-sm">Stats Overlay</h2>

            <div className="flex flex-col gap-1.5">
              <p className="text-white/40 text-[10px] uppercase tracking-widest">
                Background Opacity - {statsOpacity}%
              </p>
              <Slider
                size="sm"
                step={5}
                minValue={0}
                maxValue={100}
                value={statsOpacity}
                onChange={(v) => setStatsOpacity(v as number)}
                classNames={{ track: "bg-white/10", filler: "bg-white/40" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Accent Color</p>
              <div className="flex gap-2 flex-wrap">
                {ACCENT_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setStatsAccent(p.value)}
                    title={p.label}
                    style={p.value === "base"
                      ? { background: "conic-gradient(#4ade80, #60a5fa, #c084fc, #fb923c, #4ade80)" }
                      : { background: `#${p.value}` }
                    }
                    className={`w-6 h-6 rounded-full transition-transform ${
                      statsAccent === p.value
                        ? "ring-2 ring-white scale-110"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            <hr className="border-white/10" />

            <Button
              size="sm"
              className="w-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20"
              onPress={handleCopyStats}
              endContent={copied === "stats" ? <FiCheck className="text-blue-500" size={13} /> : null}
            >
              Copy Stats URL
            </Button>

            <p className="text-white/30 text-xs text-center leading-tight">
              Paste as Browser Source in OBS.
              <br />
              Set width 440, height 100.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}