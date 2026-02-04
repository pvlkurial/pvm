import { Autocomplete, AutocompleteItem, Button } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Tab,
  Tabs,
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
];

interface TimeGoal {
  id: number;
  name: string;
  multiplier: number;
}

interface MappackTier {
  id: number;
  name: string;
  points: number;
  color: string;
}

interface AddTrackModalProps {
  timegoals: TimeGoal[];
  mappackId: string;
  tiers: MappackTier[];
}

const parseTimeToMilliseconds = (timeString: string): number => {
  if (!timeString || timeString.trim() === "") return 0;
  
  try {
    const parts = timeString.split(':');
    if (parts.length !== 3) return 0;
    
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    const milliseconds = parseInt(parts[2]) || 0;
    
    return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
  } catch (error) {
    console.error('Error parsing time string:', timeString, error);
    return 0;
  }
};

export default function AddTrackModal({ timegoals, mappackId, tiers }: AddTrackModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [trackUuid, setTrackUuid] = useState("");
  const [tmxId, setTmxId] = useState("");
  const [tierId, setTierId] = useState<number | null>(null);
  const [mapStyleName, setMapStyleName] = useState("");
  const [timeGoalValues, setTimeGoalValues] = useState<Record<number, string>>({});
  const [selectedTab, setSelectedTab] = useState("uuid");
  const [isLoading, setIsLoading] = useState(false);

  const parseTimeToMilliseconds = (timeString: string): number => {
    const parts = timeString.split(":");
    if (parts.length !== 3) return 0;
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    const milliseconds = parseInt(parts[2]) || 0;
    return minutes * 60000 + seconds * 1000 + milliseconds;
  };

  const handleTimeGoalChange = (timeGoalId: number, value: string) => {
    setTimeGoalValues(prev => ({
      ...prev,
      [timeGoalId]: value
    }));
  };

  const handleAddTrack = async () => {
    try {
      setIsLoading(true);
      let trackId = "";

      if (selectedTab === "uuid") {
        trackId = trackUuid;
      } else if (selectedTab === "tmxid") {
        trackId = tmxId;
      }

      if (!trackId) {
        alert("Track ID is required");
        return;
      }

      if (!mapStyleName) {
        alert("Map Style is required");
        return;
      }

      // Add track to mappack with tier and map style
      await axios.post(`http://localhost:8080/mappacks/${mappackId}/tracks/${trackId}`, {
        tier_id: tierId, // Can be null
        mapStyle: mapStyleName,
      });

      // Add time goals if any are set
      const timeGoalsWithValues = timegoals
        .filter(tg => timeGoalValues[tg.id] && timeGoalValues[tg.id].trim() !== "")
        .map(tg => ({
          time_goal_id: tg.id,
          time: parseTimeToMilliseconds(timeGoalValues[tg.id]),
        }));

      if (timeGoalsWithValues.length > 0) {
        await axios.patch(
          `http://localhost:8080/mappacks/${mappackId}/tracks/${trackId}/timegoals`,
          timeGoalsWithValues
        );
      }

      // Fetch records for the track
      await axios.post(`http://localhost:8080/tracks/${trackId}/records`);

      // Reset form
      setTrackUuid("");
      setTmxId("");
      setTierId(null);
      setMapStyleName("");
      setTimeGoalValues({});
      
      onOpenChange();
      window.location.reload();
    } catch (error) {
      console.error("Error adding track:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        color="default"
        variant="bordered"
        onPress={onOpen}
        classNames={{
          base: "border-gray-700 hover:border-gray-600",
        }}
      >
        Add New Track
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
              <ModalHeader className="flex flex-col gap-1 text-2xl font-ruigslay">
                Add Track to Mappack
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                  <p className="text-xl font-ruigslay">Track Info</p>
                  <div className="flex-1 h-[5px] bg-neutral-300"></div>
                </div>

                <Tabs
                  aria-label="Track ID Input Method"
                  size="md"
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                  classNames={{
                    tabList: "bg-neutral-700",
                    cursor: "bg-neutral-800",
                    tab: "data-[selected=true]:bg-neutral-400 data-[selected=true]:!text-white",
                    tabContent: "group-data-[selected=true]:text-white",
                  }}
                >
                  <Tab key="uuid" title="UUID">
                    <Input
                      label="Track UUID"
                      placeholder="d2b8a048-209d-4cfa-b5a4-bc3e3cab3566"
                      variant="bordered"
                      value={trackUuid}
                      onValueChange={setTrackUuid}
                      classNames={{
                        input: "text-white",
                        inputWrapper:
                          "bg-neutral-800 border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                      }}
                    />
                  </Tab>
                  <Tab key="tmxid" title="TMX ID">
                    <Input
                      label="TMX ID"
                      placeholder="170211"
                      variant="bordered"
                      value={tmxId}
                      onValueChange={setTmxId}
                      classNames={{
                        input: "text-white",
                        inputWrapper:
                          "bg-neutral-800 border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                      }}
                    />
                  </Tab>
                  <Tab key="search" title="TMX Search">
                    <p className="text-gray-400 italic py-4">Coming soon...</p>
                  </Tab>
                </Tabs>

                <Autocomplete
                  items={tiers || []}
                  label="Tier (Optional)"
                  placeholder={
                    tiers?.length > 0 ? "Select tier" : "No tiers available"
                  }
                  variant="bordered"
                  selectedKey={tierId?.toString()}
                  onSelectionChange={(key) =>
                    setTierId(key ? parseInt(key as string) : null)
                  }
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
                        "bg-neutral-800 border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                    },
                  }}
                >
                  {(tier) => (
                    <AutocompleteItem
                      key={tier.id.toString()}
                      textValue={tier.name}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: tier.color }}
                        />
                        <span>{tier.name}</span>
                        <span className="text-gray-400 text-sm">
                          ({tier.points} pts)
                        </span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <Autocomplete
                  items={mapStyles}
                  label="Map Style"
                  placeholder="Search a style"
                  variant="bordered"
                  selectedKey={mapStyleName}
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
                        "bg-neutral-800 border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                    },
                  }}
                >
                  {(mapStyle) => (
                    <AutocompleteItem
                      key={mapStyle.key}
                      textValue={mapStyle.label}
                    >
                      <div className="flex flex-col">
                        <span>{mapStyle.label}</span>
                        <span className="text-xs text-gray-400">
                          {mapStyle.description}
                        </span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                    <p className="text-xl font-ruigslay">Time Goals</p>
                    <div className="flex-1 h-[5px] bg-neutral-300"></div>
                  </div>

                  {(!timegoals || timegoals.length === 0) && (
                    <p className="text-gray-400 italic text-center py-4">
                      No time goals available. Add time goals to the mappack
                      first.
                    </p>
                  )}

                  {timegoals &&
                    timegoals.map((timegoal) => (
                      <Input
                        key={timegoal.id}
                        label={`${timegoal.name} (×${timegoal.multiplier})`}
                        placeholder="1:03:942"
                        variant="bordered"
                        value={timeGoalValues[timegoal.id] || ""}
                        onValueChange={(value) =>
                          handleTimeGoalChange(timegoal.id, value)
                        }
                        classNames={{
                          input: "text-white",
                          inputWrapper:
                            "bg-neutral-800 border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                        }}
                        description="Format: MM:SS:mmm"
                      />
                    ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="bordered"
                  onPress={onClose}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="default"
                  onPress={handleAddTrack}
                  isLoading={isLoading}
                >
                  Add Track
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}