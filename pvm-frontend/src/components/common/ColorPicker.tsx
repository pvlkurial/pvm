"use client";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PRESET_COLORS = [
  "#ff0000ff",
  "#ff7b00ff",
  "#ffbf00ff",
  "#ffea00ff",
  "#000000ff",
  "#FFFFFF",
];

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({
  value,
  onChange,
  label = "Color",
}: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value);

  const handleHexChange = (newHex: string) => {
    setHexInput(newHex);
    if (HEX_COLOR.test(newHex)) {
      onChange(newHex);
    }
  };

  const handleColorChange = (newColor: string) => {
    setHexInput(newColor);
    onChange(newColor);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-36 cursor-pointer items-center gap-2.5 rounded-full border border-border bg-surface-2 pr-4 pl-1.5 transition-colors hover:border-muted-foreground/40"
        >
          <span
            className="size-7 shrink-0 rounded-full border border-border"
            style={{ backgroundColor: value }}
          />
          <span className="flex min-w-0 flex-col items-start">
            <span className="text-caption text-muted-foreground">{label}</span>
            <span className="tabular-nums text-caption text-foreground">
              {value.toUpperCase()}
            </span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto space-y-3">
        <HexColorPicker color={value} onChange={handleColorChange} />
        <Input
          aria-label="Hex code"
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#FFFFFF"
          className="tabular-nums"
        />
        <div className="flex flex-wrap justify-center gap-1">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              aria-label={presetColor}
              className="size-6 cursor-pointer rounded-full border border-border transition-transform hover:scale-110"
              style={{ backgroundColor: presetColor }}
              onClick={() => handleColorChange(presetColor)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
