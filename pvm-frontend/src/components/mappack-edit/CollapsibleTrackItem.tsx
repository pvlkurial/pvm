"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { MappackTrack, TimeGoal } from "@/types/mappack.types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormattedText } from "@/components/common/FormattedText";

interface CollapsibleTrackItemProps {
  track: MappackTrack;
  timeGoals: TimeGoal[];
  timeInputValues: Record<string, Record<number, string>>;
  onTimeGoalChange: (trackId: string, timeGoalId: number, value: string) => void;
  onMapStyleChange: (trackId: string, value: string) => void;
  onDelete: (trackId: string, trackName: string) => void;
  onOrderPositionChange: (trackId: string, value: number) => void;
  onTmxIdChange: (trackId: string, value: string) => void;
}

export function CollapsibleTrackItem({
  track,
  timeGoals,
  timeInputValues,
  onTimeGoalChange,
  onMapStyleChange,
  onDelete,
  onOrderPositionChange,
  onTmxIdChange,
}: CollapsibleTrackItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const savedTimeGoals = timeGoals.filter((tg) => tg.id);
  const trackId = track.track_id;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
      <div className="flex items-center gap-3 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="size-16 shrink-0 rounded-md object-cover"
          src={track.track.thumbnailUrl}
        />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-ui font-semibold">
            <FormattedText text={track.track.name} />
          </h3>
          <p className="mt-1 text-small text-muted-foreground">by {track.track.author}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="icon-sm"
            aria-label="Remove track"
            onClick={() => onDelete(trackId, track.track.name)}
          >
            <FaTrash className="size-3" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={isOpen ? "Collapse" : "Expand"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaChevronUp className="size-3.5" /> : <FaChevronDown className="size-3.5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4 border-t border-border-subtle p-4">
          <Field label="Map Style">
            <Input
              value={track.mapStyle || ""}
              onChange={(e) => onMapStyleChange(trackId, e.target.value)}
            />
          </Field>

          <Field label="TMX ID">
            <Input
              placeholder="123456"
              value={track.track.tmxID ?? ""}
              onChange={(e) => onTmxIdChange(trackId, e.target.value)}
            />
          </Field>

          <Field label="Order Position">
            <Input
              type="number"
              value={track.orderPosition?.toString() ?? ""}
              onChange={(e) => onOrderPositionChange(trackId, Number(e.target.value))}
            />
          </Field>

          <div className="space-y-2">
            <p className="text-small font-medium">
              Time Goals (format: minutes:seconds:milliseconds)
            </p>
            {savedTimeGoals.length === 0 ? (
              <p className="text-small text-muted-foreground italic">
                No time goals available. Create and save time goals first.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {savedTimeGoals.map((timeGoal) => (
                  <Field
                    key={timeGoal.id}
                    label={`${timeGoal.name} (×${timeGoal.multiplier})`}
                  >
                    <Input
                      placeholder="1:03:942"
                      value={timeInputValues[trackId]?.[timeGoal.id!] || ""}
                      onChange={(e) => onTimeGoalChange(trackId, timeGoal.id!, e.target.value)}
                    />
                  </Field>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
