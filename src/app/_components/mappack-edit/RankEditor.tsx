import { Button, Input, Select, SelectItem, Switch } from "@heroui/react";
import { MappackRank } from "@/types/mappack.types";
import { ColorPicker } from "@/utils/colorPicker";

interface RankEditorProps {
  rank: MappackRank;
  index: number;
  onUpdate: (index: number, field: keyof MappackRank, value: string | number | boolean | null) => void;
  onRemove: (id: number | undefined) => void;
  inputClassNames: any;
}

export function RankEditor({ rank, index, onUpdate, onRemove, inputClassNames }: RankEditorProps) {
  return (
    <div className="border border-gray-600 rounded-lg p-4 bg-neutral-700 space-y-4">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Rank Name"
          variant="bordered"
          value={rank.name}
          onValueChange={(value) => onUpdate(index, "name", value)}
          classNames={inputClassNames}
        />
        <Input
          label="Points Needed"
          type="number"
          variant="bordered"
          value={rank.pointsNeeded.toString()}
          onValueChange={(value) =>
            onUpdate(index, "pointsNeeded", parseInt(value) || 0)
          }
          classNames={inputClassNames}
        />
      </div>

      {/* Colors */}
      <div className="grid grid-cols-3 gap-3 items-end">
        <ColorPicker
          value={rank.color}
          onChange={(value) => onUpdate(index, "color", value)}
          label="Primary Color"
        />
        <ColorPicker
          value={rank.borderColor || rank.color}
          onChange={(value) => onUpdate(index, "borderColor", value)}
          label="Border Color"
        />
        <Input
          label="Border Width (px)"
          type="number"
          variant="bordered"
          value={rank.borderWidth.toString()}
          onValueChange={(value) =>
            onUpdate(index, "borderWidth", parseInt(value) || 2)
          }
          classNames={inputClassNames}
        />
      </div>

      {/* Visual Effects Toggles */}
      <div className="grid grid-cols-3 gap-4">
        <Switch
          isSelected={rank.backgroundGlow}
          onValueChange={(checked) => onUpdate(index, "backgroundGlow", checked)}
          classNames={{
            wrapper: "group-data-[selected=true]:bg-white bg-neutral-600",
          }}
        >
          <span className="text-white text-sm">Background Glow</span>
        </Switch>
        <Switch
          isSelected={rank.invertedColor}
          onValueChange={(checked) => onUpdate(index, "invertedColor", checked)}
          classNames={{
            wrapper: "group-data-[selected=true]:bg-white bg-neutral-600",
          }}
        >
          <span className="text-white text-sm">Inverted Colors</span>
        </Switch>
        <Switch
          isSelected={rank.textShadow}
          onValueChange={(checked) => onUpdate(index, "textShadow", checked)}
          classNames={{
            wrapper: "group-data-[selected=true]:bg-white bg-neutral-600",
          }}
        >
          <span className="text-white text-sm">Text Shadow</span>
        </Switch>
      </div>

      {/* Glow Intensity */}
      <Input
        label="Glow Intensity (0-100)"
        type="number"
        variant="bordered"
        value={rank.glowIntensity.toString()}
        onValueChange={(value) =>
          onUpdate(index, "glowIntensity", Math.min(100, Math.max(0, parseInt(value) || 50)))
        }
        classNames={inputClassNames}
      />

      {/* Symbols */}
      <Input
        label="Symbols Around Name (e.g., ◆ or ★★)"
        variant="bordered"
        value={rank.symbolsAround || ""}
        onValueChange={(value) => onUpdate(index, "symbolsAround", value || null)}
        placeholder="Leave empty for no symbols"
        classNames={inputClassNames}
      />

      {/* Dropdown Selects */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Animation Type"
          variant="bordered"
          selectedKeys={[rank.animationType]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onUpdate(index, "animationType", value);
          }}
          classNames={{
            ...inputClassNames,
            listboxWrapper: "bg-neutral-800",
            popoverContent: "bg-neutral-800",
            label: "text-white",
            value: "text-white",
          }}
        >
          <SelectItem key="none">None</SelectItem>
          <SelectItem key="shine">Shine</SelectItem>
          <SelectItem key="pulse">Pulse</SelectItem>
          <SelectItem key="shimmer">Shimmer</SelectItem>
        </Select>

        <Select
          label="Card Style"
          variant="bordered"
          selectedKeys={[rank.cardStyle]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onUpdate(index, "cardStyle", value);
          }}
          classNames={{
            ...inputClassNames,
            listboxWrapper: "bg-neutral-800",
            popoverContent: "bg-neutral-800",
            label: "text-white",
            value: "text-white",
          }}
        >
          <SelectItem key="normal">Normal</SelectItem>
          <SelectItem key="metallic">Metallic</SelectItem>
          <SelectItem key="holographic">Holographic</SelectItem>
          <SelectItem key="neon">Neon</SelectItem>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Select
          label="Background Pattern"
          variant="bordered"
          selectedKeys={[rank.backgroundPattern]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onUpdate(index, "backgroundPattern", value);
          }}
          classNames={{
            ...inputClassNames,
            listboxWrapper: "bg-neutral-800",
            popoverContent: "bg-neutral-800",
            label: "text-white",
            value: "text-white",
          }}
        >
          <SelectItem key="none">None</SelectItem>
          <SelectItem key="dots">Dots</SelectItem>
          <SelectItem key="grid">Grid</SelectItem>
          <SelectItem key="diagonal">Diagonal</SelectItem>
        </Select>

        <Select
          label="Font Size"
          variant="bordered"
          selectedKeys={[rank.fontSize]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onUpdate(index, "fontSize", value);
          }}
          classNames={{
            ...inputClassNames,
            listboxWrapper: "bg-neutral-800",
            popoverContent: "bg-neutral-800",
            label: "text-white",
            value: "text-white",
          }}
        >
          <SelectItem key="normal">Normal</SelectItem>
          <SelectItem key="large">Large</SelectItem>
          <SelectItem key="xl">Extra Large</SelectItem>
        </Select>

        <Select
          label="Font Weight"
          variant="bordered"
          selectedKeys={[rank.fontWeight]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onUpdate(index, "fontWeight", value);
          }}
          classNames={{
            ...inputClassNames,
            listboxWrapper: "bg-neutral-800",
            popoverContent: "bg-neutral-800",
            label: "text-white",
            value: "text-white",
          }}
        >
          <SelectItem key="normal">Normal</SelectItem>
          <SelectItem key="bold">Bold</SelectItem>
          <SelectItem key="black">Black</SelectItem>
        </Select>
      </div>

      {/* Remove Button */}
      <div className="flex justify-end">
        <Button
          color="danger"
          variant="flat"
          onPress={() => onRemove(rank.id)}
          size="sm"
        >
          Remove Rank
        </Button>
      </div>
    </div>
  );
}