import { LuX } from "react-icons/lu";
import { MappackTier, MappackTrack } from "@/types/mappack.types";
import { compareTiers } from "@/utils/mappack.utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "@/components/common/ColorPicker";
import { FormattedText } from "@/components/common/FormattedText";
import { SectionHeading } from "@/components/common/SectionHeading";

const UNASSIGNED = "unassigned";

interface TiersTabProps {
  tiers: MappackTier[];
  tracks: MappackTrack[];
  onAddTier: () => void;
  onUpdateTier: (index: number, field: keyof MappackTier, value: string | number) => void;
  onRemoveTier: (id: number | undefined) => void;
  onAssignTier: (trackId: string, tierId: number | null) => void;
}

/** A dot in the tier's colour, or a dashed ring for "no tier". */
function TierSwatch({ color, className }: { color?: string; className: string }) {
  return (
    <span
      className={className}
      style={{
        backgroundColor: color ?? "transparent",
        border: color ? "none" : "1px dashed var(--text-faint)",
      }}
    />
  );
}

/** Tracks grouped under their tier, unassigned first so the work still to do is what you land on. */
function groupTracksForAssignment(tracks: MappackTrack[], savedTiers: MappackTier[]) {
  const groups: { tier: MappackTier | null; tracks: MappackTrack[] }[] = [];

  const unassigned = tracks.filter(
    (track) => !savedTiers.some((tier) => tier.id === track.tier_id),
  );
  if (unassigned.length > 0) {
    groups.push({ tier: null, tracks: unassigned });
  }

  savedTiers.forEach((tier) => {
    const tierTracks = tracks.filter((track) => track.tier_id === tier.id);
    if (tierTracks.length > 0) {
      groups.push({ tier, tracks: tierTracks });
    }
  });

  return groups;
}

export function TiersTab({
  tiers,
  tracks,
  onAddTier,
  onUpdateTier,
  onRemoveTier,
  onAssignTier,
}: TiersTabProps) {
  // Manual order first, then points — the same precedence used everywhere else.
  // The original index rides along because onUpdateTier addresses the unsorted
  // array — sorting without it would write edits to the wrong tier.
  const orderedTiers = tiers
    .map((tier, index) => ({ tier, index }))
    .sort((a, b) => compareTiers(a.tier, b.tier));

  const savedTiers = orderedTiers.map(({ tier }) => tier).filter((tier) => tier.id);
  const groups = groupTracksForAssignment(tracks, savedTiers);

  return (
    <div className="space-y-10">
      <div>
        <SectionHeading className="mb-4">Available Tiers</SectionHeading>

        <div className="space-y-3">
          {orderedTiers.map(({ tier, index }) => (
            <div
              key={tier.id ?? `new-${index}`}
              className="flex flex-wrap items-end gap-2 rounded-xl border border-border-subtle bg-surface-2 p-3 sm:flex-nowrap"
            >
              <Field label="Tier Name" className="min-w-[120px] flex-1">
                <Input
                  value={tier.name}
                  onChange={(e) => onUpdateTier(index, "name", e.target.value)}
                />
              </Field>
              <Field label="Points" className="w-24 shrink-0">
                <Input
                  type="number"
                  value={tier.points.toString()}
                  onChange={(e) => onUpdateTier(index, "points", parseInt(e.target.value) || 0)}
                />
              </Field>
              <Field label="Order" className="w-20 shrink-0">
                <Input
                  type="number"
                  value={(tier.orderPosition ?? 0).toString()}
                  onChange={(e) =>
                    onUpdateTier(index, "orderPosition", parseInt(e.target.value) || 0)
                  }
                />
              </Field>
              <ColorPicker
                label="Tier Color"
                value={tier.color}
                onChange={(value) => onUpdateTier(index, "color", value)}
              />
              <Button
                variant="destructive"
                size="icon"
                aria-label="Remove tier"
                onClick={() => onRemoveTier(tier.id)}
              >
                <LuX className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={onAddTier} className="mt-3">
          Add Tier
        </Button>
      </div>

      <div>
        <SectionHeading className="mb-4">Track Tier Assignment</SectionHeading>

        {savedTiers.length === 0 ? (
          <p className="mt-2 text-small text-muted-foreground italic">
            No tiers available. Create and save tiers first to assign them to
            tracks.
          </p>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.tier?.id ?? UNASSIGNED}>
                {/* Divider doubles as the group label. */}
                <div className="mb-3 flex items-center gap-3">
                  <TierSwatch color={group.tier?.color} className="size-3 shrink-0 rounded-full" />
                  <span
                    className="text-small font-semibold whitespace-nowrap uppercase"
                    style={{ color: group.tier?.color ?? "var(--text-muted)" }}
                  >
                    {group.tier?.name || "Unassigned"}
                  </span>
                  {group.tier && (
                    <span className="font-mono text-mono-s whitespace-nowrap text-faint">
                      {group.tier.points} pts
                    </span>
                  )}
                  <span className="font-mono text-mono-s whitespace-nowrap text-faint">
                    {group.tracks.length}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {group.tracks.map((mappackTrack) => (
                    <div
                      key={mappackTrack.track_id}
                      className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface-2"
                    >
                      <div className="flex items-center gap-3 border-b border-border-subtle p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt=""
                          className="size-12 shrink-0 rounded-lg object-cover"
                          src={mappackTrack.track.thumbnailUrl}
                        />
                        <span className="line-clamp-2 flex-1 text-small leading-tight font-medium">
                          <FormattedText text={mappackTrack.track.name} />
                        </span>
                        <TierSwatch
                          color={group.tier?.color}
                          className="w-2 shrink-0 self-stretch rounded-full"
                        />
                      </div>

                      <div className="p-3">
                        <Select
                          value={
                            mappackTrack.tier_id ? String(mappackTrack.tier_id) : UNASSIGNED
                          }
                          onValueChange={(value) =>
                            onAssignTier(
                              mappackTrack.track_id,
                              value === UNASSIGNED ? null : parseInt(value),
                            )
                          }
                        >
                          <SelectTrigger aria-label="Assign Tier">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                            {savedTiers.map((tier) => (
                              <SelectItem key={tier.id} value={String(tier.id)}>
                                <span className="flex items-center gap-2">
                                  {tier.color && (
                                    <span
                                      className="inline-block size-3 shrink-0 rounded-full"
                                      style={{ backgroundColor: tier.color }}
                                    />
                                  )}
                                  {tier.name || "(Unnamed)"}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
