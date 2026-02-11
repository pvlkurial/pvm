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
  return (
    <div className="space-y-6">
      <div>
        <div className="grid grid-cols-[auto_1fr] items-center gap-2 mb-4">
          <p className="text-xl font-ruigslay">Available Tiers</p>
          <div className="flex-1 h-[5px] bg-neutral-300"></div>
        </div>
        {tiers.map((tier, index) => (
          <div
            key={tier.id || `new-${index}`}
            className="flex gap-2 mb-3 items-end bg-neutral-800 p-3 rounded-lg"
          >
            <Input
              label="Tier Name"
              variant="bordered"
              value={tier.name}
              onValueChange={(value) => onUpdateTier(index, "name", value)}
              className="flex-1"
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
              className="w-24"
              classNames={inputClassNames}
            />
            <ColorPicker
              value={tier.color}
              onChange={(value) => onUpdateTier(index, "color", value)}
              label="Tier Color"
            />
            <Button
              color="danger"
              variant="flat"
              onPress={() => onRemoveTier(tier.id)}
              isIconOnly
            >
              ✕
            </Button>
          </div>
        ))}
        <Button color="default" onPress={onAddTier}>
          Add Tier
        </Button>
      </div>

      <div>
        <div className="grid grid-cols-[auto_2fr] items-center gap-2 mb-4">
          <p className="text-xl font-ruigslay">Track Tier Assignment</p>
          <div className="flex-1 h-[5px] bg-neutral-300"></div>
        </div>
        {tracks.map((mappackTrack) => (
          <div
            key={mappackTrack.track_id}
            className="flex gap-2 mb-3 items-center bg-neutral-700 p-3 rounded-lg"
          >
            <Image
              removeWrapper
              alt="Track thumbnail"
              className="z-0 w-16 h-16 object-cover rounded"
              src={mappackTrack.track.thumbnailUrl}
            />
            <span className="flex-1">
              <FormattedText text={mappackTrack.track.name} />
            </span>
            <Select
              label="Tier"
              variant="bordered"
              selectedKeys={
                mappackTrack.tier_id
                  ? [mappackTrack.tier_id.toString()]
                  : []
              }
              onSelectionChange={(keys) => {
                const selectedTierId = Array.from(keys)[0] as string | undefined;
                onAssignTier(
                  mappackTrack.track_id,
                  selectedTierId ? parseInt(selectedTierId) : null
                );
              }}
              className="w-48"
              classNames={{
                ...inputClassNames,
                listboxWrapper: "bg-neutral-800",
                popoverContent: "bg-neutral-800",
                label: "text-white",
                value: "text-white",
              }}
            >
              {tiers
                .filter((tier) => tier.id)
                .map((tier) => (
                  <SelectItem key={tier.id!.toString()}>
                    {tier.name || "(Unnamed)"}
                  </SelectItem>
                ))}
            </Select>
            {mappackTrack.tier && mappackTrack.tier.color && (
              <div
                className="w-8 h-8 rounded border border-gray-600"
                style={{ backgroundColor: mappackTrack.tier.color }}
              />
            )}
          </div>
        ))}
        {tiers.filter((t) => t.id).length === 0 && (
          <p className="text-sm text-gray-400 italic mt-2">
            No tiers available. Create and save tiers first to assign them to tracks.
          </p>
        )}
      </div>
    </div>
  );
}