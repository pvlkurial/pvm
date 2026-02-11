import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { MappackTier } from "@/types/mappack.types";
import { MAP_STYLES } from "@/constants/map-styles";

interface TrackMetadataSelectorsProps {
  tiers: MappackTier[];
  tierId: number | null;
  mapStyleName: string;
  onTierChange: (tierId: number | null) => void;
  onStyleChange: (style: string) => void;
  inputClassNames: any;
}

export function TrackMetadataSelectors({
  tiers,
  tierId,
  mapStyleName,
  onTierChange,
  onStyleChange,
  inputClassNames,
}: TrackMetadataSelectorsProps) {
  const autocompleteClassNames = {
    base: "text-white",
    selectorButton: "text-white",
    listboxWrapper: "bg-neutral-800",
    popoverContent: "bg-neutral-800",
  };

  return (
    <>
      <Autocomplete
        items={tiers || []}
        label="Tier (Optional)"
        placeholder={tiers?.length > 0 ? "Select tier" : "No tiers available"}
        variant="bordered"
        selectedKey={tierId?.toString()}
        onSelectionChange={(key) =>
          onTierChange(key ? parseInt(key as string) : null)
        }
        classNames={autocompleteClassNames}
        inputProps={{
          classNames: inputClassNames,
        }}
      >
        {(tier) => (
          <AutocompleteItem key={tier.id!.toString()} textValue={tier.name}>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: tier.color }}
              />
              <span>{tier.name}</span>
              <span className="text-gray-400 text-sm">({tier.points} pts)</span>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>

      <Autocomplete
        items={MAP_STYLES}
        label="Map Style"
        placeholder="Search a style"
        variant="bordered"
        selectedKey={mapStyleName}
        onSelectionChange={(key) => onStyleChange(key as string)}
        classNames={autocompleteClassNames}
        inputProps={{
          classNames: inputClassNames,
        }}
      >
        {(mapStyle) => (
          <AutocompleteItem key={mapStyle.key} textValue={mapStyle.label}>
            <div className="flex flex-col">
              <span>{mapStyle.label}</span>
              <span className="text-xs text-gray-400">
                {mapStyle.description}
              </span>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
    </>
  );
}