import { MappackType } from "@/types/mappack.types";

export const MAPPACK_TYPES: { key: MappackType; label: string }[] = [
  { key: "pvm", label: "PVM" },
  { key: "campaign", label: "Campaign" },
  { key: "other", label: "Other" },
];

export const DEFAULT_MAPPACK_TYPE: MappackType = "pvm";
