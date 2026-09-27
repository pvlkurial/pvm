import { Mappack } from "@/types/mappack.types";
import { DEFAULT_MAPPACK_TYPE } from "@/constants/mappack-types";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SwitchField } from "@/components/ui/switch";
import { ColorPicker } from "@/components/common/ColorPicker";
import { SectionHeading } from "@/components/common/SectionHeading";
import { MapStyleSelect } from "@/components/common/MapStyleSelect";
import { MappackTypeSelect } from "@/components/common/MappackTypeSelect";

interface BasicInfoTabProps {
  editData: Mappack;
  onUpdate: (updates: Partial<Mappack>) => void;
}

type TextField = "name" | "description" | "organization" | "thumbnailURL" | "sheeturl" | "discordurl" | "websiteurl";

export function BasicInfoTab({ editData, onUpdate }: BasicInfoTabProps) {
  const textField = (label: string, field: TextField) => (
    <Field label={label}>
      <Input
        value={editData[field] ?? ""}
        onChange={(e) => onUpdate({ [field]: e.target.value })}
      />
    </Field>
  );

  return (
    <div className="space-y-4">
      <SectionHeading>Mappack Info</SectionHeading>
      {textField("Name", "name")}
      {textField("Description", "description")}
      <Field label="Type">
        <MappackTypeSelect
          value={editData.type || DEFAULT_MAPPACK_TYPE}
          onChange={(type) => onUpdate({ type })}
        />
      </Field>
      {textField("Organization", "organization")}
      {textField("Thumbnail URL", "thumbnailURL")}
      <Field label="Map Style">
        <MapStyleSelect
          value={editData.mapStyleName || null}
          onChange={(mapStyleName) => onUpdate({ mapStyleName })}
        />
      </Field>

      <SectionHeading className="pt-4">Links</SectionHeading>
      {textField("Sheet URL", "sheeturl")}
      {textField("Discord URL", "discordurl")}
      {textField("Website URL", "websiteurl")}

      <SectionHeading className="pt-4">Appearance</SectionHeading>
      <ColorPicker
        label="Accent Color"
        value={editData.accentColor || "#ffffff"}
        onChange={(accentColor) => onUpdate({ accentColor })}
      />

      <SwitchField
        label="Active"
        checked={editData.isActive}
        onCheckedChange={(isActive) => onUpdate({ isActive })}
      />
      <SwitchField
        label="Featured"
        description="Shown first in listings"
        checked={editData.featured ?? false}
        onCheckedChange={(featured) => onUpdate({ featured })}
      />
      <SwitchField
        label="New"
        description="Shows a NEW badge on the card"
        checked={editData.isNew ?? false}
        onCheckedChange={(isNew) => onUpdate({ isNew })}
      />
    </div>
  );
}
