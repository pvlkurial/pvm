"use client";
import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import { copyToClipboard } from "@/utils/clipboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Building blocks shared by the OBS overlay settings panels. */

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

export function siteOrigin(): string {
  return typeof window !== "undefined" ? window.location.origin : FALLBACK_ORIGIN;
}

export function Setting({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function AccentPicker({
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

interface CopyUrlFooterProps {
  label: string;
  url: string;
  sizeHint: string;
}

/** "Copy … URL" plus the OBS browser source instructions. */
export function CopyUrlFooter({ label, url, sizeHint }: CopyUrlFooterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  return (
    <>
      <hr className="border-border-subtle" />
      <Button size="sm" variant="outline" className="w-full" onClick={handleCopy}>
        {label}
        {copied && <LuCheck className="size-3.5" />}
      </Button>
      <p className="text-center text-small text-faint">
        Paste as Browser Source in OBS.
        <br />
        {sizeHint}
      </p>
    </>
  );
}
