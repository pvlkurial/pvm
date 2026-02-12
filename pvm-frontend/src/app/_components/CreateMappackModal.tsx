import { Autocomplete, AutocompleteItem, Button, NumberInput, Textarea } from "@heroui/react";
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

export const mapStyles = [
  { label: "Tech", key: "tech", description: "Tech tumbled" },
  { label: "Fullspeed", key: "fullspeed", description: "FS Toilet style" },
  { label: "Mixed", key: "mixed", description: "tm2020" },
  { label: "Dirt", key: "dirt", description: "noslide heaven" },
  { label: "RPG", key: "rpg", description: "rpg" },
  { label: "Trial", key: "trial", description: "final enigma style" },
  { label: "LOL", key: "giraffe", description: "yellaugh" },
  { label: "Ice", key: "ice", description: "icy" },
]

interface TimeGoal {
  name: string;
  difficulty: number;
}

export default function CreateMappackModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mapStyleName, setMapStyleName] = useState("");
  const [timeGoals, setTimeGoals] = useState<TimeGoal[]>([]);
  const [currentGoalName, setCurrentGoalName] = useState("");
  const [currentGoalDifficulty, setCurrentGoalDifficulty] = useState(1);
  const router = useRouter();

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';


  const generateId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '_');
  };

  const handleAddTimeGoal = () => {
    if (currentGoalName) {
      setTimeGoals([...timeGoals, {
        name: currentGoalName,
        difficulty: currentGoalDifficulty
      }]);
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
        name: name,
        description: description,
        map_style_name: mapStyleName,
        isActive: true,
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
      <Button 
        color="default" 
        variant="bordered" 
        onPress={onOpen}
      >
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
              <div className="">
                <ModalHeader className="flex flex-col gap-1 text-4xl font-ruigslay items-center">
                  Create Mappack
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-[auto_1fr] items-center gap-2 ">
                    <p className="text-xl font-ruigslay">Mappack Info</p>
                    <div className="flex-1 h-[5px] bg-neutral-300"></div>
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
                  <Autocomplete
                    defaultItems={mapStyles}
                    label="Map Style"
                    placeholder="Search a style"
                    variant="bordered"
                    onSelectionChange={(key) => setMapStyleName(key as string)}
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
                      }
                    }}
                  >
                    {(mapStyle) => <AutocompleteItem key={mapStyle.key}>{mapStyle.label}</AutocompleteItem>}
                  </Autocomplete>

                  <div className="grid grid-cols-[auto_1fr] items-center gap-2 mt-4">
                    <p className="text-xl font-ruigslay">Time Goals</p>
                    <div className="flex-1 h-[5px] bg-neutral-300"></div>
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
                    <Button 
                      color="default" 
                      onPress={handleAddTimeGoal}
                    >
                      Add
                    </Button>
                  </div>

                  {timeGoals.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {timeGoals.map((goal, index) => (
                        <div key={index} className="flex justify-between items-center bg-neutral-700 p-3 rounded-lg">
                          <div>
                            <p className="font-semibold">{goal.name}</p>
                            <p className="text-sm text-gray-400">Difficulty: {goal.difficulty}</p>
                          </div>
                          <Button
                            size="sm"
                            color="default"
                            variant="flat"
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
                  <Button 
                    color="default" 
                    variant="bordered" 
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button 
                    color="default" 
                    onPress={handleCreateMappack}
                  >
                    Create Mappack
                  </Button>
                </ModalFooter>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}