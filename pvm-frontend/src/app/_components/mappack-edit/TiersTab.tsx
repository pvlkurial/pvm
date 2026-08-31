import { Button, Input, Select, SelectItem, Image } from "@heroui/react";
import { MappackTier, MappackTrack } from "@/types/mappack.types";
import { ColorPicker } from "@/utils/colorPicker";
import { FormattedText } from "@/utils/textConverter";
import { ADMIN_BUTTON, ADMIN_BUTTON_DANGER } from "@/constants/button-styles";
import { SectionHeading } from "@/app/_components/SectionHeading";
import { compareTiers } from "@/utils/mappack.utils";
import { MODAL_SELECT_CLASSNAMES } from "@/constants/modal-styles";

interface TiersTabProps {
  tiers: MappackTier[];
  tracks: MappackTrack[];
  onAddTier: () => void;
  onUpdateTier: (
    index: number,
    field: keyof MappackTier,
    value: string | number,
  ) => void;
  onRemoveTier: (id: number | undefined) => void;
  onAssignTier: (trackId: string, tierId: number | null) => void;
  inputClassNames: any;
}

export function TiersTab({
  tiers,
  tracks,
  onAddTier,
  onUpdateTier,
  onRemoveTier,
  onAssignTier,
  inputClassNames,
}: TiersTabProps) {
  // Manual order first, then points — the same precedence used everywhere else.
  // The original index rides along because onUpdateTier addresses the unsorted
  // array — sorting without it would write edits to the wrong tier.
  const orderedTiers = tiers
    .map((tier, index) => ({ tier, index }))
    .sort((a, b) => compareTiers(a.tier, b.tier));

  const savedTiers = orderedTiers
    .map(({ tier }) => tier)
    .filter((tier) => tier.id);

  // Tracks grouped under the tier they are assigned to, unassigned first so the
  // work still to be done is what you land on.
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

  return (
    <div className="space-y-8">
      {/* ── Available Tiers ── */}
      <div>
        <SectionHeading className="mb-4">Available Tiers</SectionHeading>

        <div className="space-y-3">
          {orderedTiers.map(({ tier, index }) => (
            <div
              key={tier.id ?? `new-${index}`}
              className="flex flex-wrap sm:flex-nowrap gap-2 items-end bg-neutral-800 p-3 rounded-lg"
            >
              <Input
                label="Tier Name"
                variant="bordered"
                value={tier.name}
                onValueChange={(value) => onUpdateTier(index, "name", value)}
                className="flex-1 min-w-[120px]"
                classNames={inputClassNames}
              />
              <Input
                label="Points"
                type="number"
                variant="bordered"
                value={tier.points.toString()}
                onValueChange={(value) =>
                  onUpdateTier(index, "points", parseInt(value) || 0)
                }
                className="w-24 shrink-0"
                classNames={inputClassNames}
              />
              <Input
                label="Order"
                type="number"
                variant="bordered"
                value={(tier.orderPosition ?? 0).toString()}
                onValueChange={(value) =>
                  onUpdateTier(index, "orderPosition", parseInt(value) || 0)
                }
                className="w-20 shrink-0"
                classNames={inputClassNames}
              />
              <div className="shrink-0">
                <ColorPicker
                  value={tier.color}
                  onChange={(value) => onUpdateTier(index, "color", value)}
                  label="Tier Color"
                />
              </div>
              <Button
                onPress={() => onRemoveTier(tier.id)}
                isIconOnly
                className={`shrink-0 ${ADMIN_BUTTON_DANGER}`}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>

        <Button onPress={onAddTier} className={`mt-3 ${ADMIN_BUTTON}`}>
          Add Tier
        </Button>
      </div>

      {/* ── Track Tier Assignment ── */}
      <div>
        <SectionHeading className="mb-4">Track Tier Assignment</SectionHeading>

        {savedTiers.length === 0 ? (
          <p className="text-sm text-gray-400 italic mt-2">
            No tiers available. Create and save tiers first to assign them to
            tracks.
          </p>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.tier?.id ?? "unassigned"}>
                {/* Divider doubles as the group label. */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{
                      backgroundColor: group.tier?.color ?? "transparent",
                      border: group.tier?.color ? "none" : "1px dashed #666",
                    }}
                  />
                  <span
                    className="text-sm font-semibold uppercase tracking-wide whitespace-nowrap"
                    style={{ color: group.tier?.color ?? "#9ca3af" }}
                  >
                    {group.tier?.name || "Unassigned"}
                  </span>
                  {group.tier && (
                    <span className="text-xs text-white/40 whitespace-nowrap">
                      {group.tier.points} pts
                    </span>
                  )}
                  <span className="text-xs text-white/30 whitespace-nowrap">
                    {group.tracks.length}
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {group.tracks.map((mappackTrack) => {
                    // Stable Set<string> — HeroUI Select needs string keys.
                    const selectedKeys = mappackTrack.tier_id
                      ? new Set([String(mappackTrack.tier_id)])
                      : new Set<string>();

                    return (
                      <div
                        key={mappackTrack.track_id}
                        className="flex flex-col bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700"
                      >
                        <div className="flex items-center gap-3 p-3 border-b border-neutral-700">
                          <Image
                            removeWrapper
                            alt="Track thumbnail"
                            className="w-12 h-12 object-cover rounded-lg shrink-0"
                            src={mappackTrack.track.thumbnailUrl}
                          />
                          <span className="flex-1 text-sm font-medium leading-tight line-clamp-2">
                            <FormattedText text={mappackTrack.track.name} />
                          </span>
                          <div
                            className="w-2 self-stretch rounded-full shrink-0 transition-colors duration-200"
                            style={{
                              backgroundColor:
                                group.tier?.color ?? "transparent",
                              border: group.tier?.color
                                ? "none"
                                : "1px dashed #555",
                            }}
                          />
                        </div>

                        <div className="p-3">
                          <Select
                            label="Assign Tier"
                            variant="underlined"
                            selectedKeys={selectedKeys}
                            onSelectionChange={(keys) => {
                              const arr = Array.from(keys as Set<string>);
                              const key = arr[0];
                              onAssignTier(
                                mappackTrack.track_id,
                                key !== undefined ? parseInt(key) : null,
                              );
                            }}
                            classNames={MODAL_SELECT_CLASSNAMES}
                          >
                            {savedTiers.map((tier) => (
                              <SelectItem
                                key={String(tier.id!)}
                                textValue={tier.name || "(Unnamed)"}
                                startContent={
                                  tier.color ? (
                                    <span
                                      className="inline-block w-3 h-3 rounded-full shrink-0"
                                      style={{ backgroundColor: tier.color }}
                                    />
                                  ) : undefined
                                }
                              >
                                {tier.name || "(Unnamed)"}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
