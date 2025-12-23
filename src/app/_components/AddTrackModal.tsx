import { Autocomplete, AutocompleteItem, Button, NumberInput } from "@heroui/react";
import { useRouter } from "next/navigation";
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
]

export const mapTiers = [
  { label: "S", key: "S" },
  { label: "A", key: "A" },
  { label: "B", key: "B" },
  { label: "C", key: "C" },
  { label: "D", key: "D" },
  { label: "E", key: "E" },
  { label: "F", key: "F" },
  { label: "god", key: "god" },
]

export default function AddTrackModal({ timegoals, mappackId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [trackUuid, setTrackUuid] = useState("");
  const [tmxId, setTmxId] = useState("");
  const [tier, setTier] = useState("");
  const [mapStyleName, setMapStyleName] = useState("");
  const [timeGoalValues, setTimeGoalValues] = useState({});
  const [selectedTab, setSelectedTab] = useState("uuid");
  const router = useRouter();

  const parseTimeToMilliseconds = (timeString: string) => {
    const parts = timeString.split(":");
    if (parts.length !== 3) return 0;
    const minutes = parseInt(parts[0]);
    const seconds = parseInt(parts[1]);
    const milliseconds = parseInt(parts[2]);
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
      let trackId = "";

      if (selectedTab === "uuid") {
        trackId = trackUuid;
      } else if (selectedTab === "tmxid") {
        trackId = tmxId;
      }

      if (!trackId || !tier || !mapStyleName) {
        console.error("Track ID, Tier, and Map Style are required");
        return;
      }

      await axios.post(`http://localhost:8080/mappacks/${mappackId}/tracks/${trackId}`, {
        tier: tier,
        map_style_name: mapStyleName,
      });

      const timeGoalsPayload = timegoals.map(timegoal => ({
        time_goal_id: timegoal.ID,
        time: parseTimeToMilliseconds(timeGoalValues[timegoal.ID] || "0:00:000"),
      }));

      await axios.post(
        `http://localhost:8080/mappacks/${mappackId}/tracks/${trackId}/timegoals`,
        timeGoalsPayload
      );
      await axios.post(
        `http://localhost:8080/tracks/${trackId}/records`,
        null
      )
      onOpenChange();
      window.location.reload()
    } catch (error) {
      console.error("Error adding track:", error);
    }
  };

  return (
    <div>
      <Button
        color="default"
        variant="bordered"
        onPress={onOpen}
        classNames={{
          base: "border-gray-700 hover:border-gray-600"
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
              <div className="">
                <ModalHeader className="flex flex-col gap-1 text-2xl font-ruigslay">
                  Add Track to Mappack
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-[auto_1fr] items-center gap-2 ">
                    <p className="text-xl font-ruigslay">Track Info</p>
                    <div className="flex-1 h-[5px] bg-neutral-300"></div>
                  </div>
                  <Tabs
                    aria-label="Tabs"
                    size="md"
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key as string)}
                    classNames={{
                      tabList: "bg-neutral-700",
                      cursor: "bg-neutral-800",
                      tab: "data-[selected=true]:bg-neutral-400 data-[selected=true]:!text-white",
                      tabContent: "group-data-[selected=true]:text-white",
                      tabWrapper: "text-white",
                    }}
                  >
                    <Tab key="uuid" title="UUID">
                      <Input
                        label="Track UUID"
                        placeholder="example: d2b8a048-209d-4cfa-b5a4-bc3e3cab3566"
                        variant="bordered"
                        value={trackUuid}
                        onValueChange={setTrackUuid}
                        classNames={{
                          input: "text-white",
                          inputWrapper:
                            "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                        }}
                      />
                    </Tab>
                    <Tab key="tmxid" title="TMX ID">
                      <Input
                        label="TMX ID"
                        placeholder="example: 170211"
                        variant="bordered"
                        value={tmxId}
                        onValueChange={setTmxId}
                        classNames={{
                          input: "text-white",
                          inputWrapper:
                            "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                        }}
                      />
                    </Tab>
                    <Tab key="tmx search" title="TMX Search">
                      <h1>Coming soon...</h1>
                    </Tab>
                  </Tabs>
                  <Autocomplete
                    defaultItems={mapTiers}
                    label="Tier"
                    placeholder="Select tier"
                    variant="bordered"
                    onSelectionChange={(key) => setTier(key as string)}
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
                    {(tier) => <AutocompleteItem key={tier.key}>{tier.label}</AutocompleteItem>}
                  </Autocomplete>
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
                  <div className="flex flex-col gap-1">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2 ">
                      <p className="text-xl font-ruigslay">Time Goals</p>
                      <div className="flex-1 h-[5px] bg-neutral-300"></div>
                    </div>
                    {timegoals && Array.isArray(timegoals) && timegoals.map((timegoal) => (
                      <Input
                        key={`timegoal-${timegoal.ID}`}
                        label={`${timegoal.name} (ID: ${timegoal.ID})`}
                        placeholder="0:59:328"
                        variant="bordered"
                        value={timeGoalValues[timegoal.ID] || ""}
                        onValueChange={(value) => handleTimeGoalChange(timegoal.ID, value)}
                        classNames={{
                          input: "text-white",
                          inputWrapper:
                            "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
                        }}
                      />
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={onClose}
                    classNames={{
                      base: "bg-red-600/10 hover:bg-red-600/20"
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleAddTrack}
                    classNames={{
                      base: "bg-blue-600 hover:bg-blue-700"
                    }}
                  >
                    Add Track
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