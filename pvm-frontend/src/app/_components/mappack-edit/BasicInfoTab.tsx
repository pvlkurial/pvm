import { Input, Switch } from "@heroui/react";
import { Mappack } from "@/types/mappack.types";

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