"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MappackType } from "@/types/mappack.types";
import { DEFAULT_MAPPACK_TYPE } from "@/constants/mappack-types";
import { DEFAULT_MAP_STYLE } from "@/constants/map-styles";
import { mappackService } from "@/services/mappack.service";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { SwitchField } from "@/components/ui/switch";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SectionHeading } from "@/components/common/SectionHeading";
import { MapStyleSelect } from "@/components/common/MapStyleSelect";
import { MappackTypeSelect } from "@/components/common/MappackTypeSelect";

interface NewTimeGoal {
  name: string;
  difficulty: number;
}

const toMappackId = (name: string) => name.toLowerCase().replace(/\s+/g, "_");

interface CreateMappackDialogProps {
  /** The element that opens the dialog. */
  children: React.ReactNode;
}

export function CreateMappackDialog({ children }: CreateMappackDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mapStyleName, setMapStyleName] = useState<string | null>(null);
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [type, setType] = useState<MappackType>(DEFAULT_MAPPACK_TYPE);
  const [featured, setFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [timeGoals, setTimeGoals] = useState<NewTimeGoal[]>([]);
  const [goalName, setGoalName] = useState("");
  const [goalDifficulty, setGoalDifficulty] = useState(1);

  const handleAddTimeGoal = () => {
    if (!goalName) return;
    setTimeGoals([...timeGoals, { name: goalName, difficulty: goalDifficulty }]);
    setGoalName("");
    setGoalDifficulty(1);
  };

  const handleRemoveTimeGoal = (index: number) => {
    setTimeGoals(timeGoals.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    try {
      const mappackId = toMappackId(name);

      await mappackService.createMappack({
        id: mappackId,
        name,
        description,
        thumbnailURL,
        isActive: true,
        type,
        featured,
        isNew,
        mapStyleName: mapStyleName ?? DEFAULT_MAP_STYLE,
      });

      for (const goal of timeGoals) {
        await mappackService.createTimeGoal(mappackId, goal);
      }

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating mappack:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Mappack</DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-4 pb-6">
          <SectionHeading>Mappack Info</SectionHeading>
          <Field label="Mappack Name">
            <Input
              placeholder="Fullspeed PVM"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Description">
            <Textarea
              placeholder="Enter mappack description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field label="Thumbnail URL">
            <Input
              placeholder="https://..."
              value={thumbnailURL}
              onChange={(e) => setThumbnailURL(e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type">
              <MappackTypeSelect value={type} onChange={setType} />
            </Field>
            <Field label="Map Style">
              <MapStyleSelect value={mapStyleName} onChange={setMapStyleName} />
            </Field>
          </div>

          <SwitchField
            label="Featured"
            description="Shown first in listings"
            checked={featured}
            onCheckedChange={setFeatured}
          />
          <SwitchField
            label="New"
            description="Shows a NEW badge on the card"
            checked={isNew}
            onCheckedChange={setIsNew}
          />

          <SectionHeading className="mt-6">Time Goals</SectionHeading>

          <div className="flex items-end gap-2">
            <Field label="Goal Name" className="flex-1">
              <Input
                placeholder="Bronze"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
            </Field>
            <Field label="Difficulty" className="w-32">
              <Input
                type="number"
                min={1}
                value={goalDifficulty}
                onChange={(e) => setGoalDifficulty(Number(e.target.value) || 1)}
              />
            </Field>
            <Button variant="outline" onClick={handleAddTimeGoal}>
              Add
            </Button>
          </div>

          {timeGoals.length > 0 && (
            <ul className="flex flex-col gap-2">
              {timeGoals.map((goal, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-3"
                >
                  <div>
                    <p className="text-ui font-medium">{goal.name}</p>
                    <p className="mt-1 text-small text-muted-foreground">
                      Difficulty: {goal.difficulty}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveTimeGoal(index)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={handleCreate}>Create Mappack</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
