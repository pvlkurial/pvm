import { Button, Input, Select, SelectItem, Image } from "@heroui/react";
import { MappackTier, MappackTrack } from "@/types/mappack.types";
import { ColorPicker } from "@/utils/colorPicker";
import { FormattedText } from "@/utils/textConverter";

interface TiersTabProps {
  tiers: MappackTier[];
  tracks: MappackTrack[];
  onAddTier: () => void;
  onUpdateTier: (index: number, field: keyof MappackTier, value: string | number) => void;
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
  const savedTiers = tiers
    .filter((t) => t.id)
    .sort((a, b) => b.points - a.points);

  const sortedTracks = [...tracks].sort((a, b) => {
    if (!a.tier_id && !b.tier_id) return 0;
    if (!a.tier_id) return -1;
    if (!b.tier_id) return 1;
    const tierA = savedTiers.find((t) => t.id === a.tier_id);
    const tierB = savedTiers.find((t) => t.id === b.tier_id);
    return (tierB?.points ?? 0) - (tierA?.points ?? 0);
  });

  return (
    <div className="space-y-8">
      {/* ── Available Tiers ── */}
      <div>
        <div className="grid grid-cols-[auto_1fr] items-center gap-2 mb-4">
          <p className="text-xl font-ruigslay">Available Tiers</p>
          <div className="flex-1 h-[5px] bg-neutral-300" />
        </div>

        <div className="space-y-3">
          {tiers.map((tier, index) => (
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
              <div className="shrink-0">
                <ColorPicker
                  value={tier.color}
                  onChange={(value) => onUpdateTier(index, "color", value)}
                  label="Tier Color"
                />
              </div>
              <Button
                color="danger"
                variant="flat"
                onPress={() => onRemoveTier(tier.id)}
                isIconOnly
                className="shrink-0"
              >
                ✕
              </Button>
            </div>
          ))}
        </div>

        <Button color="default" onPress={onAddTier} className="mt-3">
          Add Tier
        </Button>
      </div>

      {/* ── Track Tier Assignment ── */}
      <div>
        <div className="grid grid-cols-[auto_2fr] items-center gap-2 mb-4">
          <p className="text-xl font-ruigslay">Track Tier Assignment</p>
          <div className="flex-1 h-[5px] bg-neutral-300" />
        </div>

        {savedTiers.length === 0 ? (
          <p className="text-sm text-gray-400 italic mt-2">
            No tiers available. Create and save tiers first to assign them to tracks.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {sortedTracks.map((mappackTrack) => {
              const assignedTier = savedTiers.find(
                (t) => t.id === mappackTrack.tier_id
              );
              // Use a stable Set<string> — HeroUI Select needs string keys
              const selectedKeys = mappackTrack.tier_id
                ? new Set([String(mappackTrack.tier_id)])
                : new Set<string>();

              return (
                <div
                  key={mappackTrack.track_id}
                  className="flex flex-col bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700"
                >
                  {/* Track header */}
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
                    {/* Tier color swatch */}
                    <div
                      className="w-2 self-stretch rounded-full shrink-0 transition-colors duration-200"
                      style={{
                        backgroundColor: assignedTier?.color ?? "transparent",
                        border: assignedTier?.color
                          ? "none"
                          : "1px dashed #555",
                      }}
                    />
                  </div>

                  {/* Tier select */}
                  <div className="p-3">
                    <Select
                      label="Assign Tier"
                      variant="underlined"
                      selectedKeys={selectedKeys}
                      onSelectionChange={(keys) => {
                        // keys is SharedSelection — convert to array of strings safely
                        const arr = Array.from(keys as Set<string>);
                        const key = arr[0];
                        onAssignTier(
                          mappackTrack.track_id,
                          key !== undefined ? parseInt(key) : null,
                        );
                      }}
                      classNames={{
                        ...inputClassNames,
                        listboxWrapper: "bg-neutral-800",
                        popoverContent: "bg-neutral-800",
                        label: "text-white",
                        value: "text-white",
                        innerWrapper: "text-white",
                        trigger: "text-white cursor-pointer",
                        
                      }}
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
        )}
      </div>
    </div>
  );
}