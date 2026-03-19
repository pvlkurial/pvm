"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Button,
} from "@heroui/react";
import { useState } from "react";
import { Track } from "@/types/mappack.types";
import { FiMonitor, FiCheck } from "react-icons/fi";

interface TrackCardOBSProps {
  track: Track;
  mappackId: string;
}

export function TrackCardOBS({ track, mappackId }: TrackCardOBSProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const goals = [...(track.timegoals ?? [])].sort(
    (a, b) => a.multiplier - b.multiplier,
  );

  const [selectedIndex, setSelectedIndex] = useState("0");

  const overlayUrl = () => {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://pvms.club";
    return `${base}/overlay/${mappackId}/${track.id}?goalIndex=${selectedIndex}`;
  };

  const handleCopy = async () => {
    const url = overlayUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1500);
  };

  return (
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

      <PopoverContent className="bg-zinc-900 border border-white/20 text-white p-4 max-w-xs">
        <div className="flex flex-col gap-3 w-full">
          <h2 className="text-heading text-sm">OBS Overlay</h2>

          {goals.length > 0 ? (
            <RadioGroup
              value={selectedIndex}
              onValueChange={setSelectedIndex}
              size="sm"
            >
              {goals.map((g, i) => (
                <Radio
                  key={i}
                  value={String(i)}
                  classNames={{ label: "text-white/80 text-xs" }}
                >
                  {g.name}
                </Radio>
              ))}
            </RadioGroup>
          ) : (
            <p className="text-white/30 text-sm">No goals defined</p>
          )}

          <hr className="border-white/10" />

          <Button
            size="sm"
            className="w-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20"
            onPress={handleCopy}
            endContent={
              copied ? <FiCheck className="text-blue-500" size={13} /> : null
            }
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
  );
}
