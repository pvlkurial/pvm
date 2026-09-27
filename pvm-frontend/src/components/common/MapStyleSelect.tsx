import { MAP_STYLES } from "@/constants/map-styles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MapStyleSelectProps {
  /** The style's label, which is what the API stores. */
  value: string | null;
  onChange: (label: string) => void;
}

export function MapStyleSelect({ value, onChange }: MapStyleSelectProps) {
  return (
    <Select value={value ?? undefined} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Pick a style" />
      </SelectTrigger>
      <SelectContent>
        {MAP_STYLES.map((style) => (
          <SelectItem key={style.key} value={style.label}>
            {style.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
