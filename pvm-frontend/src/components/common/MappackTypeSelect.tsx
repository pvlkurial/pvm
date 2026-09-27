import { MappackType } from "@/types/mappack.types";
import { MAPPACK_TYPES } from "@/constants/mappack-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MappackTypeSelectProps {
  value: MappackType;
  onChange: (type: MappackType) => void;
}

export function MappackTypeSelect({ value, onChange }: MappackTypeSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as MappackType)}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {MAPPACK_TYPES.map((type) => (
          <SelectItem key={type.key} value={type.key}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
