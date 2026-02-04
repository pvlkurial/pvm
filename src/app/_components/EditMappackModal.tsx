import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tabs,
  Tab,
  Select,
  SelectItem,
  Switch,
  Image,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { ColorPicker } from "../_utils/colorPicker";
import { FormattedText } from "../_utils/textConverter";

// Backend-aligned interfaces - match Go JSON tags exactly
interface TimeGoal {
  id?: number;
  name: string;
  mappack_id: string;
  multiplier: number;
}

interface MappackTier {
  id?: number;
  name: string;
  mappack_id: string;
  points: number;
  color: string;
}

interface TimeGoalMappackTrack {
  track_id: string;
  mappack_id: string;
  time_goal_id: number;
  time: number;
}

interface Track {
  id: string;
  name: string;
  author: string;
  thumbnailUrl: string;
  dominantColor: string;
}

interface MappackTrack {
  mappack_id: string;
  track_id: string;
  track: Track;
  timeGoalMappackTrack: TimeGoalMappackTrack[]; // Match backend casing
  tier_id: number | null;
  tier: MappackTier | null;
  mapStyle: string | null;
}

interface Mappack {
  id: string;
  name: string;
  description: string;
  thumbnailURL: string;
  isActive: boolean;
  MappackTrack: MappackTrack[]; // Capital M to match backend
  timeGoals: TimeGoal[];
  mappackTiers: MappackTier[];
}

interface EditMappackModalProps {
  mappack: Mappack | null;
  onSave: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const millisecondsToTimeString = (ms: number): string => {
  if (!ms || ms === 0) return "";

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  return `${minutes}:${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
};

const timeStringToMilliseconds = (timeString: string): number => {
  if (!timeString || timeString.trim() === "") return 0;

  try {
    const parts = timeString.split(":");
    if (parts.length !== 3) return 0;

    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    const milliseconds = parseInt(parts[2]) || 0;

    return minutes * 60 * 1000 + seconds * 1000 + milliseconds;
  } catch (error) {
    console.error("Error parsing time string:", timeString, error);
    return 0;
  }
};

export function EditMappackModal({
  mappack,
  onSave,
  isOpen,
  onClose,
}: EditMappackModalProps) {
  const [editData, setEditData] = useState<Mappack | null>(null);
  const [availableTiers, setAvailableTiers] = useState<MappackTier[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [timeInputValues, setTimeInputValues] = useState<
    Record<string, Record<number, string>>
  >({});
  useEffect(() => {
    if (isOpen && mappack) {
      console.log("Loading mappack into editor:", mappack); // DEBUG

      const deepCopy = JSON.parse(JSON.stringify(mappack));
      const initialTimeInputs: Record<string, Record<number, string>> = {};
      // Initialize all arrays to prevent undefined errors
      const sanitizedData = {
        ...deepCopy,
        timeGoals: deepCopy.timeGoals || [],
        mappackTiers: deepCopy.mappackTiers || [],
        MappackTrack: (deepCopy.MappackTrack || []).map((track) => ({
          ...track,
          timeGoalMappackTrack: track.timeGoalMappackTrack || [],
          tier: track.tier || null,
          mapStyle: track.mapStyle || null,
          tier_id: track.tier_id || null,
        })),
      };

      console.log("Sanitized data:", sanitizedData);
      setEditData(sanitizedData);
    }
  }, [isOpen, mappack]);

  if (!editData) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        id: editData.id,
        name: editData.name,
        description: editData.description,
        thumbnailURL: editData.thumbnailURL,
        isActive: editData.isActive,
        timeGoals: editData.timeGoals.map((tg) => ({
          id: tg.id,
          name: tg.name,
          mappack_id: editData.id,
          multiplier: tg.multiplier,
        })),
        mappackTiers: editData.mappackTiers.map((tier) => ({
          id: tier.id,
          name: tier.name,
          mappack_id: editData.id,
          points: tier.points,
          color: tier.color,
        })),
        MappackTrack: editData.MappackTrack.map((track) => ({
          mappack_id: track.mappack_id,
          track_id: track.track_id,
          tier_id: track.tier_id,
          mapStyle: track.mapStyle,
          timeGoalMappackTrack: track.timeGoalMappackTrack.map((tg) => ({
            track_id: track.track_id,
            mappack_id: editData.id,
            time_goal_id: tg.time_goal_id,
            time: tg.time,
          })),
        })),
      };

      const response = await fetch(`http://localhost:8080/mappacks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update mappack: ${errorText}`);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving mappack:", error);
      alert(
        `Failed to save mappack: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const addTimeGoal = () => {
    setEditData({
      ...editData,
      timeGoals: [
        ...editData.timeGoals,
        {
          name: "",
          mappack_id: editData.id,
          multiplier: 1,
        },
      ],
    });
  };

  const removeTimeGoal = (id: number | undefined) => {
    if (!id) {
      setEditData({
        ...editData,
        timeGoals: editData.timeGoals.slice(0, -1),
      });
      return;
    }

    setEditData({
      ...editData,
      timeGoals: editData.timeGoals.filter((tg) => tg.id !== id),
      MappackTrack: editData.MappackTrack.map((track) => ({
        ...track,
        timeGoalMappackTrack: track.timeGoalMappackTrack.filter(
          (tgmt) => tgmt.time_goal_id !== id,
        ),
      })),
    });
  };

  const updateTimeGoal = (
    index: number,
    field: keyof TimeGoal,
    value: string | number,
  ) => {
    setEditData({
      ...editData,
      timeGoals: editData.timeGoals.map((tg, i) =>
        i === index ? { ...tg, [field]: value } : tg,
      ),
    });
  };

const updateTrackTime = (
  trackId: string,
  timeGoalId: number,
  timeString: string,
) => {
  setTimeInputValues(prev => ({
    ...prev,
    [trackId]: {
      ...(prev[trackId] || {}),
      [timeGoalId]: timeString
    }
  }));
  
  const milliseconds = timeStringToMilliseconds(timeString);
  
  setEditData({
    ...editData,
    MappackTrack: editData.MappackTrack.map((track) => {
      if (track.track_id !== trackId) return track;
      
      const existingIndex = track.timeGoalMappackTrack.findIndex(
        (tgmt) => tgmt.time_goal_id === timeGoalId,
      );
      
      if (existingIndex >= 0) {
        return {
          ...track,
          timeGoalMappackTrack: track.timeGoalMappackTrack.map((tgmt, i) =>
            i === existingIndex ? { ...tgmt, time: milliseconds } : tgmt,
          ),
        };
      } else {
        return {
          ...track,
          timeGoalMappackTrack: [
            ...track.timeGoalMappackTrack,
            {
              track_id: trackId,
              mappack_id: editData.id,
              time_goal_id: timeGoalId,
              time: milliseconds,
            },
          ],
        };
      }
    }),
  });
};

  const addTier = () => {
    const newTier: MappackTier = {
      name: "",
      mappack_id: editData.id,
      points: 0,
      color: "#ffffff",
    };
    setEditData({
      ...editData,
      mappackTiers: [...editData.mappackTiers, newTier],
    });
  };

  const updateTier = (
    index: number,
    field: keyof MappackTier,
    value: string | number,
  ) => {
    const updatedTiers = editData.mappackTiers.map((tier, i) =>
      i === index ? { ...tier, [field]: value } : tier,
    );
    setEditData({
      ...editData,
      mappackTiers: updatedTiers,
    });
  };

  const removeTier = (index: number) => {
    const tierToRemove = editData.mappackTiers[index];
    setEditData({
      ...editData,
      mappackTiers: editData.mappackTiers.filter((_, i) => i !== index),
      MappackTrack: editData.MappackTrack.map((track) =>
        track.tier_id === tierToRemove.id
          ? { ...track, tier_id: null, tier: null }
          : track,
      ),
    });
  };

  const assignTierToTrack = (trackId: string, tierId: number | null) => {
    const tier = tierId
      ? editData.mappackTiers.find((t) => t.id === tierId)
      : null;
    setEditData({
      ...editData,
      MappackTrack: editData.MappackTrack.map((track) =>
        track.track_id === trackId
          ? { ...track, tier_id: tierId, tier: tier || null }
          : track,
      ),
    });
  };

  const inputClassNames = {
    input: "text-white",
    inputWrapper:
      "bg-neutral-800 border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="top-center"
      size="5xl"
      scrollBehavior="inside"
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
              Edit Mappack
            </ModalHeader>
            <ModalBody>
              <Tabs
                classNames={{
                  tabList: "bg-neutral-700",
                  cursor: "bg-neutral-600",
                  tab: "text-white",
                  tabContent: "group-data-[selected=true]:text-white",
                }}
              >
                <Tab key="basic" title="Basic Info">
                  <div className="space-y-4">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                      <p className="text-xl font-ruigslay">Mappack Info</p>
                      <div className="flex-1 h-[5px] bg-neutral-300"></div>
                    </div>
                    <Input
                      label="Name"
                      variant="bordered"
                      value={editData.name}
                      onValueChange={(value) =>
                        setEditData({ ...editData, name: value })
                      }
                      classNames={inputClassNames}
                    />
                    <Input
                      label="Description"
                      variant="bordered"
                      value={editData.description}
                      onValueChange={(value) =>
                        setEditData({ ...editData, description: value })
                      }
                      classNames={inputClassNames}
                    />
                    <Input
                      label="Thumbnail URL"
                      variant="bordered"
                      value={editData.thumbnailURL}
                      onValueChange={(value) =>
                        setEditData({ ...editData, thumbnailURL: value })
                      }
                      classNames={inputClassNames}
                    />
                    <Switch
                      isSelected={editData.isActive}
                      onValueChange={(checked) =>
                        setEditData({ ...editData, isActive: checked })
                      }
                      classNames={{
                        wrapper:
                          "group-data-[selected=true]:bg-white bg-neutral-600",
                      }}
                    >
                      <span className="text-white">Active</span>
                    </Switch>
                  </div>
                </Tab>

                <Tab key="timegoals" title="Time Goals">
                  <div className="space-y-4">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                      <p className="text-xl font-ruigslay">Time Goals</p>
                      <div className="flex-1 h-[5px] bg-neutral-300"></div>
                    </div>
                    {editData.timeGoals.map((timegoal, index) => (
                      <div
                        key={timegoal.id || `new-${index}`}
                        className="flex gap-2 items-center bg-neutral-700 p-3 rounded-lg"
                      >
                        <Input
                          label="Name"
                          variant="bordered"
                          value={timegoal.name}
                          onValueChange={(value) =>
                            updateTimeGoal(index, "name", value)
                          }
                          className="flex-1"
                          classNames={inputClassNames}
                        />
                        <Input
                          label="Multiplier"
                          type="number"
                          variant="bordered"
                          value={timegoal.multiplier.toString()}
                          onValueChange={(value) =>
                            updateTimeGoal(
                              index,
                              "multiplier",
                              parseInt(value) || 1,
                            )
                          }
                          className="w-32"
                          classNames={inputClassNames}
                        />
                        <Button
                          size="sm"
                          color="default"
                          variant="flat"
                          onPress={() => removeTimeGoal(timegoal.id)}
                          isIconOnly
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    <Button color="default" onPress={addTimeGoal}>
                      Add Time Goal
                    </Button>
                  </div>
                </Tab>

                <Tab key="tiers" title="Tiers">
                  <div className="space-y-6">
                    <div>
                      <div className="grid grid-cols-[auto_1fr] items-center gap-2 mb-4">
                        <p className="text-xl font-ruigslay">Available Tiers</p>
                        <div className="flex-1 h-[5px] bg-neutral-300"></div>
                      </div>
                      {editData.mappackTiers.map((tier, index) => (
                        <div
                          key={tier.id || `new-${index}`}
                          className="flex gap-2 mb-3 items-end bg-neutral-700 p-3 rounded-lg"
                        >
                          <Input
                            label="Tier Name"
                            variant="bordered"
                            value={tier.name}
                            onValueChange={(value) =>
                              updateTier(index, "name", value)
                            }
                            className="flex-1"
                            classNames={inputClassNames}
                          />
                          <Input
                            label="Points"
                            type="number"
                            variant="bordered"
                            value={tier.points.toString()}
                            onValueChange={(value) =>
                              updateTier(index, "points", parseInt(value) || 0)
                            }
                            className="w-24"
                            classNames={inputClassNames}
                          />
                          <ColorPicker
                            value={tier.color}
                            onChange={(value) =>
                              updateTier(index, "color", value)
                            }
                            label="Tier Color"
                          />
                          <Button
                            color="default"
                            variant="flat"
                            onPress={() => removeTier(index)}
                            isIconOnly
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                      <Button color="default" onPress={addTier}>
                        Add Tier
                      </Button>
                    </div>

                    <div>
                      <div className="grid grid-cols-[auto_1fr] items-center gap-2 mb-4">
                        <p className="text-xl font-ruigslay">
                          Track Tier Assignment
                        </p>
                        <div className="flex-1 h-[5px] bg-neutral-300"></div>
                      </div>
                      {editData.MappackTrack.map((mappackTrack) => (
                        <div
                          key={mappackTrack.track_id}
                          className="flex gap-2 mb-3 items-center bg-neutral-700 p-3 rounded-lg"
                        >
                          <Image
                            removeWrapper
                            alt="Track thumbnail"
                            className="z-0 w-16 h-16 object-cover rounded"
                            src={mappackTrack.track.thumbnailUrl}
                          />
                          <span className="flex-1">
                            <FormattedText text={mappackTrack.track.name} />
                          </span>
                          <Select
                            label="Tier"
                            variant="bordered"
                            selectedKeys={
                              mappackTrack.tier_id
                                ? [mappackTrack.tier_id.toString()]
                                : []
                            }
                            onSelectionChange={(keys) => {
                              const selectedTierId = Array.from(keys)[0] as
                                | string
                                | undefined;
                              assignTierToTrack(
                                mappackTrack.track_id,
                                selectedTierId
                                  ? parseInt(selectedTierId)
                                  : null,
                              );
                            }}
                            className="w-48"
                            classNames={{
                              ...inputClassNames,
                              listboxWrapper: "bg-neutral-800",
                              popoverContent: "bg-neutral-800",
                              label: "text-white",
                              value: "text-white",
                            }}
                          >
                            <SelectItem key="" value="">
                              (No Tier)
                            </SelectItem>
                            {editData.mappackTiers
                              .filter((tier) => tier.id) // Only show saved tiers
                              .map((tier) => (
                                <SelectItem
                                  key={tier.id!.toString()}
                                  value={tier.id!.toString()}
                                >
                                  {tier.name || "(Unnamed)"}
                                </SelectItem>
                              ))}
                          </Select>
                          {mappackTrack.tier && mappackTrack.tier.color && (
                            <div
                              className="w-8 h-8 rounded border border-gray-600"
                              style={{
                                backgroundColor: mappackTrack.tier.color,
                              }}
                            />
                          )}
                        </div>
                      ))}
                      {editData.mappackTiers.filter((t) => t.id).length ===
                        0 && (
                        <p className="text-sm text-gray-400 italic mt-2">
                          No tiers available. Create and save tiers first to
                          assign them to tracks.
                        </p>
                      )}
                    </div>
                  </div>
                </Tab>

                <Tab key="tracks" title="Track Times">
                  <div className="space-y-6">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2 mb-4">
                      <p className="text-xl font-ruigslay">Track Time Goals</p>
                      <div className="flex-1 h-[5px] bg-neutral-300"></div>
                    </div>
                    {(editData.MappackTrack || []).length === 0 && (
                      <p className="text-gray-400 italic text-center py-8">
                        No tracks in this mappack.
                      </p>
                    )}
                    {(editData.MappackTrack || []).map((mappackTrack) => (
                      <div
                        key={mappackTrack.track_id}
                        className="border border-gray-700 rounded-lg p-4 bg-neutral-700"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <Image
                            removeWrapper
                            alt="Track thumbnail"
                            className="w-20 h-20 object-cover rounded"
                            src={mappackTrack.track.thumbnailUrl}
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">
                              <FormattedText text={mappackTrack.track.name} />
                            </h3>
                            <p className="text-sm text-gray-400">
                              by {mappackTrack.track.author}
                            </p>
                          </div>
                        </div>

                        <Input
                          label="Map Style"
                          variant="bordered"
                          value={mappackTrack.mapStyle || ""}
                          onValueChange={(value) => {
                            setEditData({
                              ...editData,
                              MappackTrack: (editData.MappackTrack || []).map(
                                (t) =>
                                  t.track_id === mappackTrack.track_id
                                    ? { ...t, mapStyle: value || null }
                                    : t,
                              ),
                            });
                          }}
                          className="mb-4"
                          classNames={inputClassNames}
                        />

                        <div className="mt-4">
                          <p className="text-sm mb-3 font-semibold">
                            Time Goals (format: minutes:seconds:milliseconds):
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {(editData.timeGoals || [])
                              .filter((tg) => tg.id)
                              .map((timegoal) => {
                                const inputValue =
                                  timeInputValues[mappackTrack.track_id]?.[
                                    timegoal.id
                                  ] || "";

                                return (
                                  <Input
                                    key={timegoal.id}
                                    label={`${timegoal.name} (×${timegoal.multiplier})`}
                                    placeholder="1:03:942"
                                    variant="bordered"
                                    value={inputValue}
                                    onValueChange={(value) => {
                                      updateTrackTime(
                                        mappackTrack.track_id,
                                        timegoal.id!,
                                        value,
                                      );
                                    }}
                                    classNames={inputClassNames}
                                    description="Format: MM:SS:mmm"
                                  />
                                );
                              })}
                          </div>
                          {(editData.timeGoals || []).filter((tg) => tg.id)
                            .length === 0 && (
                            <p className="text-sm text-gray-400 italic">
                              No time goals available. Create and save time
                              goals first.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="bordered" onPress={onClose}>
                Cancel
              </Button>
              <Button color="default" onPress={handleSave} isLoading={isSaving}>
                Save All Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
