import {
  Autocomplete,
  AutocompleteItem,
  Button,
  NumberInput,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@heroui/react";
import { useState } from "react";
import axios from "axios";
import { API_BASE } from "@/constants/miscellaneous";
import { MAP_STYLES } from "@/constants/map-styles";
import { MAPPACK_TYPES, DEFAULT_MAPPACK_TYPE } from "@/constants/mappack-types";
import { MappackType } from "@/types/mappack.types";
import { ADMIN_BUTTON, ADMIN_BUTTON_PRIMARY, ADMIN_BUTTON_DANGER } from "@/constants/button-styles";

interface TimeGoal {
  name: string;
  difficulty: number;
}

export default function CreateMappackModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mapStyleName, setMapStyleName] = useState<string | null>(null);
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [type, setType] = useState<MappackType>(DEFAULT_MAPPACK_TYPE);
  const [featured, setFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [timeGoals, setTimeGoals] = useState<TimeGoal[]>([]);
  const [currentGoalName, setCurrentGoalName] = useState("");
  const [currentGoalDifficulty, setCurrentGoalDifficulty] = useState(1);
  const router = useRouter();

  const generateId = (name: string) => name.toLowerCase().replace(/\s+/g, "_");

  const handleAddTimeGoal = () => {
    if (currentGoalName) {
      setTimeGoals([
        ...timeGoals,
        { name: currentGoalName, difficulty: currentGoalDifficulty },
      ]);
      setCurrentGoalName("");
      setCurrentGoalDifficulty(1);
    }
  };

  const handleRemoveTimeGoal = (index: number) => {
    setTimeGoals(timeGoals.filter((_, i) => i !== index));
  };

  const handleCreateMappack = async () => {
    try {
      const mappackId = generateId(name);

      await axios.post(`${API_BASE}/mappacks`, {
        id: mappackId,
        name,
        description,
        thumbnailURL,
        isActive: true,
        type,
        featured,
        isNew,
        ...(mapStyleName ? { mapStyleName } : { mapStyleName: "Tech" }),
      });

      for (const goal of timeGoals) {
        await axios.post(`${API_BASE}/mappacks/${mappackId}/timegoals`, {
          name: goal.name,
          difficulty: goal.difficulty,
          mappack_id: mappackId,
        });
      }

      onOpenChange();
      router.refresh();
    } catch (error) {
      console.error("Error creating mappack:", error);
    }
  };

  return (
    <div>
      <Button className={ADMIN_BUTTON} onPress={onOpen}>
        Add Mappack
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        size="2xl"
        classNames={{
          base: "bg-neutral-800",
          header: "bg-neutral-800 text-white",
          body: "bg-neutral-800 text-white",
          footer: "bg-neutral-800",
          closeButton: "text-white hover:bg-neutral-800",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-4xl font-ruigslay items-center">
                Create Mappack
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                  <p className="text-xl font-ruigslay">Mappack Info</p>
                  <div className="flex-1 h-[5px] bg-neutral-300" />
                </div>
                <Input
                  label="Mappack Name"
                  placeholder="Fullspeed PVM"
                  variant="bordered"
                  value={name}
                  onValueChange={setName}
                  classNames={{
                    input: "text-white",
                    inputWrapper:
                      "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                  }}
                />
                <Textarea
                  label="Description"
                  placeholder="Enter mappack description"
                  variant="bordered"
                  value={description}
                  onValueChange={setDescription}
                  classNames={{
                    input: "text-white",
                    inputWrapper:
                      "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                  }}
                />
                <Input
                  label="Thumbnail URL"
                  placeholder="https://..."
                  variant="bordered"
                  value={thumbnailURL}
                  onValueChange={setThumbnailURL}
                  classNames={{
                    input: "text-white",
                    inputWrapper:
                      "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                  }}
                />
                <Select
                  label="Type"
                  variant="bordered"
                  selectedKeys={new Set([type])}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys as Set<string>)[0] as
                      | MappackType
                      | undefined;
                    if (value) setType(value);
                  }}
                  classNames={{
                    listboxWrapper: "bg-neutral-800",
                    popoverContent: "bg-neutral-800",
                    label: "text-white",
                    value: "text-white",
                    trigger:
                      "border-gray-700 data-[hover=true]:border-gray-600 data-[open=true]:bg-neutral-900 data-[open=true]:border-white",
                  }}
                >
                  {MAPPACK_TYPES.map((mappackType) => (
                    <SelectItem key={mappackType.key}>
                      {mappackType.label}
                    </SelectItem>
                  ))}
                </Select>
                <Autocomplete
                  defaultItems={MAP_STYLES}
                  label="Map Style"
                  placeholder="Search a style"
                  variant="bordered"
                  onSelectionChange={(key) => {
                    const match = MAP_STYLES.find((s) => s.key === key);
                    setMapStyleName(match?.label ?? null);
                  }}
                  classNames={{
                    base: "text-white",
                    selectorButton: "text-white",
                    listboxWrapper: "bg-neutral-800",
                    popoverContent: "bg-neutral-800",
                  }}
                  inputProps={{
                    classNames: {
                      input: "text-white",
                      inputWrapper:
                        "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                    },
                  }}
                >
                  {(mapStyle) => (
                    <AutocompleteItem key={mapStyle.key}>
                      {mapStyle.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <Switch
                  isSelected={featured}
                  onValueChange={setFeatured}
                  classNames={{
                    wrapper: "group-data-[selected=true]:bg-white bg-neutral-600",
                  }}
                >
                  <span className="text-white">
                    Featured
                    <span className="block text-xs text-neutral-400">
                      Shown first in listings
                    </span>
                  </span>
                </Switch>

                <Switch
                  isSelected={isNew}
                  onValueChange={setIsNew}
                  classNames={{
                    wrapper: "group-data-[selected=true]:bg-white bg-neutral-600",
                  }}
                >
                  <span className="text-white">
                    New
                    <span className="block text-xs text-neutral-400">
                      Shows a NEW badge on the card
                    </span>
                  </span>
                </Switch>

                <div className="grid grid-cols-[auto_1fr] items-center gap-2 mt-4">
                  <p className="text-xl font-ruigslay">Time Goals</p>
                  <div className="flex-1 h-[5px] bg-neutral-300" />
                </div>

                <div className="flex gap-2 items-center justify-between">
                  <Input
                    label="Goal Name"
                    placeholder="Bronze"
                    variant="bordered"
                    value={currentGoalName}
                    onValueChange={setCurrentGoalName}
                    classNames={{
                      input: "text-white",
                      inputWrapper:
                        "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                    }}
                  />
                  <NumberInput
                    label="Difficulty"
                    placeholder="1"
                    variant="bordered"
                    value={currentGoalDifficulty}
                    onValueChange={setCurrentGoalDifficulty}
                    min={1}
                    classNames={{
                      input: "text-white",
                      inputWrapper:
                        "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                    }}
                  />
                  <Button className={ADMIN_BUTTON} onPress={handleAddTimeGoal}>
                    Add
                  </Button>
                </div>

                {timeGoals.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {timeGoals.map((goal, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-neutral-700 p-3 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{goal.name}</p>
                          <p className="text-sm text-gray-400">
                            Difficulty: {goal.difficulty}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className={ADMIN_BUTTON_DANGER}
                          onPress={() => handleRemoveTimeGoal(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button className={ADMIN_BUTTON} onPress={onClose}>
                  Close
                </Button>
                <Button className={ADMIN_BUTTON_PRIMARY} onPress={handleCreateMappack}>
                  Create Mappack
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
