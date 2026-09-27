"use client";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { MappackRank } from "@/types/mappack.types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SwitchField } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "@/components/common/ColorPicker";

export type RankFieldUpdate = (
  index: number,
  field: keyof MappackRank,
  value: string | number | boolean | null,
) => void;

type Option = { value: string; label: string };

/** The cosmetic dropdowns, in the order they are laid out. */
const STYLE_SELECTS: { field: keyof MappackRank; label: string; options: Option[] }[] = [
  {
    field: "animationType",
    label: "Animation Type",
    options: [
      { value: "none", label: "None" },
      { value: "shine", label: "Shine" },
      { value: "pulse", label: "Pulse" },
      { value: "shimmer", label: "Shimmer" },
    ],
  },
  {
    field: "cardStyle",
    label: "Card Style",
    options: [
      { value: "normal", label: "Normal" },
      { value: "metallic", label: "Metallic" },
      { value: "holographic", label: "Holographic" },
      { value: "neon", label: "Neon" },
    ],
  },
  {
    field: "backgroundPattern",
    label: "Background Pattern",
    options: [
      { value: "none", label: "None" },
      { value: "dots", label: "Dots" },
      { value: "grid", label: "Grid" },
      { value: "diagonal", label: "Diagonal" },
    ],
  },
  {
    field: "fontSize",
    label: "Font Size",
    options: [
      { value: "normal", label: "Normal" },
      { value: "large", label: "Large" },
      { value: "xl", label: "Extra Large" },
    ],
  },
  {
    field: "fontWeight",
    label: "Font Weight",
    options: [
      { value: "normal", label: "Normal" },
      { value: "bold", label: "Bold" },
      { value: "black", label: "Black" },
    ],
  },
];

const EFFECT_TOGGLES: { field: "backgroundGlow" | "invertedColor" | "textShadow"; label: string }[] = [
  { field: "backgroundGlow", label: "Background Glow" },
  { field: "invertedColor", label: "Inverted Colors" },
  { field: "textShadow", label: "Text Shadow" },
];

interface RankEditorProps {
  rank: MappackRank;
  index: number;
  onUpdate: RankFieldUpdate;
  onRemove: (id: number | undefined) => void;
}

export function RankEditor({ rank, index, onUpdate, onRemove }: RankEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const update = (field: keyof MappackRank, value: string | number | boolean | null) =>
    onUpdate(index, field, value);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-3"
      >
        <span
          className="size-3 shrink-0 rounded-full border border-border"
          style={{ backgroundColor: rank.color || "transparent" }}
        />
        <span className="flex-1 text-ui font-medium">
          {rank.name || <span className="text-muted-foreground italic">Unnamed Rank</span>}
        </span>
        <span className="shrink-0 tabular-nums text-caption text-faint">
          {rank.pointsNeeded} pts
        </span>
        <LuChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-border-subtle px-4 pt-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Rank Name">
              <Input value={rank.name} onChange={(e) => update("name", e.target.value)} />
            </Field>
            <Field label="Points Needed">
              <Input
                type="number"
                value={rank.pointsNeeded.toString()}
                onChange={(e) => update("pointsNeeded", parseInt(e.target.value) || 0)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 items-end gap-3">
            <ColorPicker
              label="Primary Color"
              value={rank.color}
              onChange={(value) => update("color", value)}
            />
            <ColorPicker
              label="Border Color"
              value={rank.borderColor || rank.color}
              onChange={(value) => update("borderColor", value)}
            />
            <Field label="Border Width (px)">
              <Input
                type="number"
                value={rank.borderWidth.toString()}
                onChange={(e) => update("borderWidth", parseInt(e.target.value) || 2)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {EFFECT_TOGGLES.map(({ field, label }) => (
              <SwitchField
                key={field}
                label={label}
                checked={rank[field]}
                onCheckedChange={(checked) => update(field, checked)}
              />
            ))}
          </div>

          <Field label="Glow Intensity (0-100)">
            <Input
              type="number"
              value={rank.glowIntensity.toString()}
              onChange={(e) =>
                update(
                  "glowIntensity",
                  Math.min(100, Math.max(0, parseInt(e.target.value) || 50)),
                )
              }
            />
          </Field>

          <Field label="Symbols Around Name (e.g., ◆ or ★★)">
            <Input
              value={rank.symbolsAround || ""}
              placeholder="Leave empty for no symbols"
              onChange={(e) => update("symbolsAround", e.target.value || null)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {STYLE_SELECTS.map(({ field, label, options }) => (
              <Field key={field} label={label}>
                <Select
                  value={String(rank[field] ?? "")}
                  onValueChange={(value) => update(field, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ))}
          </div>

          <div className="flex justify-end">
            <Button variant="destructive" size="sm" onClick={() => onRemove(rank.id)}>
              Remove Rank
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
