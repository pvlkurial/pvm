import { Autocomplete, AutocompleteItem, Input, Switch } from "@heroui/react";
import { Mappack } from "@/types/mappack.types";
import { MAP_STYLES } from "@/constants/map-styles";
import { ColorPicker } from "@/utils/colorPicker";

interface BasicInfoTabProps {
  editData: Mappack;
  onUpdate: (updates: Partial<Mappack>) => void;
  inputClassNames: any;
}

export function BasicInfoTab({
  editData,
  onUpdate,
  inputClassNames,
}: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <p className="text-xl font-ruigslay">Mappack Info</p>
        <div className="flex-1 h-[5px] bg-neutral-300"></div>
      </div>
      <Input
        label="Name"
        variant="bordered"
        value={editData.name}
        onValueChange={(value) => onUpdate({ name: value })}
        classNames={inputClassNames}
      />
      <Input
        label="Description"
        variant="bordered"
        value={editData.description}
        onValueChange={(value) => onUpdate({ description: value })}
        classNames={inputClassNames}
      />
      <Input
        label="Organization"
        variant="bordered"
        value={editData.organization}
        onValueChange={(value) => onUpdate({ organization: value })}
        classNames={inputClassNames}
      />
      <Input
        label="Thumbnail URL"
        variant="bordered"
        value={editData.thumbnailURL}
        onValueChange={(value) => onUpdate({ thumbnailURL: value })}
        classNames={inputClassNames}
      />
      <Autocomplete
        defaultItems={MAP_STYLES}
        label="Map Style"
        placeholder="Search a style"
        variant="bordered"
        defaultSelectedKey={
          MAP_STYLES.find((s) => s.label === editData.mapStyleName)?.key
        }
        onSelectionChange={(key) => {
          const match = MAP_STYLES.find((s) => s.key === key);
          onUpdate({ mapStyleName: match?.label ?? "" });
        }}
        classNames={{
          base: "text-white",
          selectorButton: "text-white",
          listboxWrapper: "bg-neutral-800",
          popoverContent: "bg-neutral-800",
        }}
        inputProps={{ classNames: inputClassNames }}
      >
        {(style) => (
          <AutocompleteItem key={style.key}>{style.label}</AutocompleteItem>
        )}
      </Autocomplete>

      <div className="grid grid-cols-[auto_1fr] items-center gap-2 pt-2">
        <p className="text-xl font-ruigslay">Links</p>
        <div className="flex-1 h-[5px] bg-neutral-300"></div>
      </div>
      <Input
        label="Sheet URL"
        variant="bordered"
        value={editData.sheeturl}
        onValueChange={(value) => onUpdate({ sheeturl: value })}
        classNames={inputClassNames}
      />
      <Input
        label="Discord URL"
        variant="bordered"
        value={editData.discordurl}
        onValueChange={(value) => onUpdate({ discordurl: value })}
        classNames={inputClassNames}
      />
      <Input
        label="Website URL"
        variant="bordered"
        value={editData.websiteurl}
        onValueChange={(value) => onUpdate({ websiteurl: value })}
        classNames={inputClassNames}
      />

      <div className="grid grid-cols-[auto_1fr] items-center gap-2 pt-2">
        <p className="text-xl font-ruigslay">Appearance</p>
        <div className="flex-1 h-[5px] bg-neutral-300"></div>
      </div>
      <div className="flex items-center gap-3">
        <ColorPicker
          label="Accent Color"
          value={editData.accentColor || "#ffffff"}
          onChange={(color) => onUpdate({ accentColor: color })}
        />
      </div>

      <Switch
        isSelected={editData.isActive}
        onValueChange={(checked) => onUpdate({ isActive: checked })}
        classNames={{
          wrapper: "group-data-[selected=true]:bg-white bg-neutral-600",
        }}
      >
        <span className="text-white">Active</span>
      </Switch>
    </div>
  );
}
