import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { MappackTier } from "@/types/mappack.types";
import { MAP_STYLES } from "@/constants/map-styles";
import {
  MODAL_AUTOCOMPLETE_CLASSNAMES,
} from "@/constants/modal-styles";

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

  return <></>;
}
