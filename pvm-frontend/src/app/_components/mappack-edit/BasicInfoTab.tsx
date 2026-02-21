import { Autocomplete, AutocompleteItem, Input, Switch } from "@heroui/react";
import { Mappack } from "@/types/mappack.types";
import { mapStyles } from "@/app/_components/CreateMappackModal";

interface BasicInfoTabProps {
  editData: Mappack;
  onUpdate: (updates: Partial<Mappack>) => void;
  inputClassNames: any;
}

export function BasicInfoTab({ editData, onUpdate, inputClassNames }: BasicInfoTabProps) {
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
        label="Thumbnail URL"
        variant="bordered"
        value={editData.thumbnailURL}
        onValueChange={(value) => onUpdate({ thumbnailURL: value })}
        classNames={inputClassNames}
      />
      <Autocomplete
        defaultItems={mapStyles}
        label="Map Style"
        placeholder="Search a style"
        variant="bordered"
        defaultSelectedKey={
          mapStyles.find(s => s.label === editData.mapStyleName)?.key
        }
        onSelectionChange={(key) => {
          const match = mapStyles.find(s => s.key === key);
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