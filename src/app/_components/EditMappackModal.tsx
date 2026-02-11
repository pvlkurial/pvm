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
import { ConfirmDialog } from "./ConfirmDialog";

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

interface MappackRank {
  id?: number;
  name: string;
  mappack_id: string;
  pointsNeeded: number;
  color: string;
  backgroundGlow: boolean;
  invertedColor: boolean;
  textShadow: boolean;
  glowIntensity: number;
  borderWidth: number;
  borderColor?: string | null;
  symbolsAround?: string | null;
  animationType: string;
  cardStyle: string;
  backgroundPattern: string;
  fontSize: string;
  fontWeight: string;
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
  timeGoalMappackTrack: TimeGoalMappackTrack[];
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
  MappackTrack: MappackTrack[];
  timeGoals: TimeGoal[];
  mappackTiers: MappackTier[];
  mappackRanks: MappackRank[];
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
  const [isSaving, setIsSaving] = useState(false);
  const [timeInputValues, setTimeInputValues] = useState<Record<string, Record<number, string>>>({});
const [confirmDialog, setConfirmDialog] = useState<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
} | null>(null);
  useEffect(() => {
    if (isOpen && mappack) {
      console.log("Loading mappack into editor:", mappack);

      const deepCopy = JSON.parse(JSON.stringify(mappack));
      
      const sanitizedData = {
        ...deepCopy,
        timeGoals: deepCopy.timeGoals || [],
        mappackTiers: deepCopy.mappackTiers || [],
        mappackRanks: deepCopy.mappackRanks || [],
        MappackTrack: (deepCopy.MappackTrack || []).map((track: any) => ({
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
        mappackRanks: editData.mappackRanks.map((rank) => ({
          id: rank.id,
          name: rank.name,
          mappack_id: editData.id,
          pointsNeeded: rank.pointsNeeded,
          color: rank.color,
          backgroundGlow: rank.backgroundGlow,
          invertedColor: rank.invertedColor,
          textShadow: rank.textShadow,
          glowIntensity: rank.glowIntensity,
          borderWidth: rank.borderWidth,
          borderColor: rank.borderColor,
          symbolsAround: rank.symbolsAround,
          animationType: rank.animationType,
          cardStyle: rank.cardStyle,
          backgroundPattern: rank.backgroundPattern,
          fontSize: rank.fontSize,
          fontWeight: rank.fontWeight,
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

  const removeTimeGoal = async (id: number | undefined) => {
    if (!id) {
      setEditData({
        ...editData,
        timeGoals: editData.timeGoals.slice(0, -1),
      });
      return;
    }
  setConfirmDialog({
    isOpen: true,
    title: "Delete Time Goal",
    message: "This will permanently delete this time goal and all associated player achievements. This action cannot be undone.",
    onConfirm: async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/mappacks/${editData.id}/timegoals/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Failed to delete");

        setEditData({
          ...editData,
          timeGoals: editData.timeGoals.filter((tg) => tg.id !== id),
          MappackTrack: editData.MappackTrack.map((track) => ({
            ...track,
            timeGoalMappackTrack: track.timeGoalMappackTrack.filter(
              (tgmt) => tgmt.time_goal_id !== id
            ),
          })),
        });
      } catch (error) {
        console.error("Error deleting time goal:", error);
        alert("Failed to delete time goal");
      }
    },
  });
};

  const updateTimeGoal = (
    index: number,
    field: keyof TimeGoal,
    value: string | number
  ) => {
    setEditData({
      ...editData,
      timeGoals: editData.timeGoals.map((tg, i) =>
        i === index ? { ...tg, [field]: value } : tg
      ),
    });
  };

  const updateTrackTime = (
    trackId: string,
    timeGoalId: number,
    timeString: string
  ) => {
    setTimeInputValues((prev) => ({
      ...prev,
      [trackId]: {
        ...(prev[trackId] || {}),
        [timeGoalId]: timeString,
      },
    }));

    const milliseconds = timeStringToMilliseconds(timeString);

    setEditData({
      ...editData,
      MappackTrack: editData.MappackTrack.map((track) => {
        if (track.track_id !== trackId) return track;

        const existingIndex = track.timeGoalMappackTrack.findIndex(
          (tgmt) => tgmt.time_goal_id === timeGoalId
        );

        if (existingIndex >= 0) {
          return {
            ...track,
            timeGoalMappackTrack: track.timeGoalMappackTrack.map((tgmt, i) =>
              i === existingIndex ? { ...tgmt, time: milliseconds } : tgmt
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
    value: string | number
  ) => {
    const updatedTiers = editData.mappackTiers.map((tier, i) =>
      i === index ? { ...tier, [field]: value } : tier
    );
    setEditData({
      ...editData,
      mappackTiers: updatedTiers,
    });
  };

  const removeTier = async (id: number | undefined) => {
    if (!id) {
      setEditData({
        ...editData,
        mappackTiers: editData.mappackTiers.slice(0, -1),
      });
      return;
    }

   setConfirmDialog({
    isOpen: true,
    title: "Delete Tier",
    message: "This will remove this tier. Tracks assigned to this tier will become unranked.",
    onConfirm: async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/mappacks/${editData.id}/tiers/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Failed to delete");

        setEditData({
          ...editData,
          mappackTiers: editData.mappackTiers.filter((t) => t.id !== id),
          MappackTrack: editData.MappackTrack.map((track) =>
            track.tier_id === id
              ? { ...track, tier_id: null, tier: null }
              : track
          ),
        });
      } catch (error) {
        console.error("Error deleting tier:", error);
        alert("Failed to delete tier");
      }
    },
  });
};

  const addRank = () => {
    const newRank: MappackRank = {
      name: "",
      mappack_id: editData.id,
      pointsNeeded: 0,
      color: "#ffffff",
      backgroundGlow: false,
      invertedColor: false,
      textShadow: false,
      glowIntensity: 50,
      borderWidth: 2,
      borderColor: null,
      symbolsAround: null,
      animationType: "none",
      cardStyle: "normal",
      backgroundPattern: "none",
      fontSize: "normal",
      fontWeight: "normal",
    };
    setEditData({
      ...editData,
      mappackRanks: [...editData.mappackRanks, newRank],
    });
  };

  const updateRank = (
    index: number,
    field: keyof MappackRank,
    value: string | number | boolean | null
  ) => {
    const updatedRanks = editData.mappackRanks.map((rank, i) =>
      i === index ? { ...rank, [field]: value } : rank
    );
    setEditData({
      ...editData,
      mappackRanks: updatedRanks,
    });
  };

  const removeRank = async (id: number | undefined) => {
    if (!id) {
      // Just remove from state if not saved yet
      setEditData({
        ...editData,
        mappackRanks: editData.mappackRanks.slice(0, -1),
      });
      return;
    }

    setConfirmDialog({
    isOpen: true,
    title: "Delete Rank",
    message: "This will permanently delete this rank. Players with this rank will be re-assigned based on their points.",
    onConfirm: async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/mappacks/${editData.id}/ranks/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Failed to delete");

        setEditData({
          ...editData,
          mappackRanks: editData.mappackRanks.filter((r) => r.id !== id),
        });
      } catch (error) {
        console.error("Error deleting rank:", error);
        alert("Failed to delete rank");
      }
    },
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
          : track
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
                        className="flex gap-2 items-center bg-neutral-800 p-3 rounded-lg"
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
                              parseInt(value) || 1
                            )
                          }
                          className="w-32"
                          classNames={inputClassNames}
                        />
                        <Button
                          size="sm"
                          color="danger"
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
                          className="flex gap-2 mb-3 items-end bg-neutral-800 p-3 rounded-lg"
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
                            color="danger"
                            variant="flat"
                            onPress={() => removeTier(tier.id)}
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
                      <div className="grid grid-cols-[auto_2fr] items-center gap-2 mb-4">
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
                                  : null
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
                            {editData.mappackTiers
                              .filter((tier) => tier.id)
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

                <Tab key="ranks" title="Ranks">
                  <div className="space-y-4">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                      <p className="text-xl font-ruigslay">Player Ranks</p>
                      <div className="flex-1 h-[5px] bg-neutral-300"></div>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Ranks are awarded to players based on their total points.
                      Customize the appearance of each rank.
                    </p>

                    {editData.mappackRanks.map((rank, index) => (
                      <div
                        key={rank.id || `new-${index}`}
                        className="border border-gray-600 rounded-lg p-4 bg-neutral-700 space-y-4"
                      >
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label="Rank Name"
                            variant="bordered"
                            value={rank.name}
                            onValueChange={(value) =>
                              updateRank(index, "name", value)
                            }
                            classNames={inputClassNames}
                          />
                          <Input
                            label="Points Needed"
                            type="number"
                            variant="bordered"
                            value={rank.pointsNeeded.toString()}
                            onValueChange={(value) =>
                              updateRank(
                                index,
                                "pointsNeeded",
                                parseInt(value) || 0
                              )
                            }
                            classNames={inputClassNames}
                          />
                        </div>

                        {/* Colors */}
                        <div className="grid grid-cols-3 gap-3 items-end">
                          <ColorPicker
                            value={rank.color}
                            onChange={(value) =>
                              updateRank(index, "color", value)
                            }
                            label="Primary Color"
                          />
                          <ColorPicker
                            value={rank.borderColor || rank.color}
                            onChange={(value) =>
                              updateRank(index, "borderColor", value)
                            }
                            label="Border Color"
                          />
                          <Input
                            label="Border Width (px)"
                            type="number"
                            variant="bordered"
                            value={rank.borderWidth.toString()}
                            onValueChange={(value) =>
                              updateRank(
                                index,
                                "borderWidth",
                                parseInt(value) || 2
                              )
                            }
                            classNames={inputClassNames}
                          />
                        </div>

                        {/* Visual Effects Toggles */}
                        <div className="grid grid-cols-3 gap-4">
                          <Switch
                            isSelected={rank.backgroundGlow}
                            onValueChange={(checked) =>
                              updateRank(index, "backgroundGlow", checked)
                            }
                            classNames={{
                              wrapper:
                                "group-data-[selected=true]:bg-white bg-neutral-600",
                            }}
                          >
                            <span className="text-white text-sm">
                              Background Glow
                            </span>
                          </Switch>
                          <Switch
                            isSelected={rank.invertedColor}
                            onValueChange={(checked) =>
                              updateRank(index, "invertedColor", checked)
                            }
                            classNames={{
                              wrapper:
                                "group-data-[selected=true]:bg-white bg-neutral-600",
                            }}
                          >
                            <span className="text-white text-sm">
                              Inverted Colors
                            </span>
                          </Switch>
                          <Switch
                            isSelected={rank.textShadow}
                            onValueChange={(checked) =>
                              updateRank(index, "textShadow", checked)
                            }
                            classNames={{
                              wrapper:
                                "group-data-[selected=true]:bg-white bg-neutral-600",
                            }}
                          >
                            <span className="text-white text-sm">
                              Text Shadow
                            </span>
                          </Switch>
                        </div>

                        {/* Glow Intensity */}
                        <Input
                          label="Glow Intensity (0-100)"
                          type="number"
                          variant="bordered"
                          value={rank.glowIntensity.toString()}
                          onValueChange={(value) =>
                            updateRank(
                              index,
                              "glowIntensity",
                              Math.min(100, Math.max(0, parseInt(value) || 50))
                            )
                          }
                          classNames={inputClassNames}
                        />

                        {/* Symbols */}
                        <Input
                          label="Symbols Around Name (e.g., ◆ or ★★)"
                          variant="bordered"
                          value={rank.symbolsAround || ""}
                          onValueChange={(value) =>
                            updateRank(index, "symbolsAround", value || null)
                          }
                          placeholder="Leave empty for no symbols"
                          classNames={inputClassNames}
                        />

                        {/* Dropdown Selects */}
                        <div className="grid grid-cols-2 gap-3">
                          <Select
                            label="Animation Type"
                            variant="bordered"
                            selectedKeys={[rank.animationType]}
                            onSelectionChange={(keys) => {
                              const value = Array.from(keys)[0] as string;
                              updateRank(index, "animationType", value);
                            }}
                            classNames={{
                              ...inputClassNames,
                              listboxWrapper: "bg-neutral-800",
                              popoverContent: "bg-neutral-800",
                              label: "text-white",
                              value: "text-white",
                            }}
                          >
                            <SelectItem key="none" value="none">
                              None
                            </SelectItem>
                            <SelectItem key="shine" value="shine">
                              Shine
                            </SelectItem>
                            <SelectItem key="pulse" value="pulse">
                              Pulse
                            </SelectItem>
                            <SelectItem key="shimmer" value="shimmer">
                              Shimmer
                            </SelectItem>
                          </Select>

                          <Select
                            label="Card Style"
                            variant="bordered"
                            selectedKeys={[rank.cardStyle]}
                            onSelectionChange={(keys) => {
                              const value = Array.from(keys)[0] as string;
                              updateRank(index, "cardStyle", value);
                            }}
                            classNames={{
                              ...inputClassNames,
                              listboxWrapper: "bg-neutral-800",
                              popoverContent: "bg-neutral-800",
                              label: "text-white",
                              value: "text-white",
                            }}
                          >
                            <SelectItem key="normal" value="normal">
                              Normal
                            </SelectItem>
                            <SelectItem key="metallic" value="metallic">
                              Metallic
                            </SelectItem>
                            <SelectItem key="holographic" value="holographic">
                              Holographic
                            </SelectItem>
                            <SelectItem key="neon" value="neon">
                              Neon
                            </SelectItem>
                          </Select>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <Select
                            label="Background Pattern"
                            variant="bordered"
                            selectedKeys={[rank.backgroundPattern]}
                            onSelectionChange={(keys) => {
                              const value = Array.from(keys)[0] as string;
                              updateRank(index, "backgroundPattern", value);
                            }}
                            classNames={{
                              ...inputClassNames,
                              listboxWrapper: "bg-neutral-800",
                              popoverContent: "bg-neutral-800",
                              label: "text-white",
                              value: "text-white",
                            }}
                          >
                            <SelectItem key="none" value="none">
                              None
                            </SelectItem>
                            <SelectItem key="dots" value="dots">
                              Dots
                            </SelectItem>
                            <SelectItem key="grid" value="grid">
                              Grid
                            </SelectItem>
                            <SelectItem key="diagonal" value="diagonal">
                              Diagonal
                            </SelectItem>
                          </Select>

                          <Select
                            label="Font Size"
                            variant="bordered"
                            selectedKeys={[rank.fontSize]}
                            onSelectionChange={(keys) => {
                              const value = Array.from(keys)[0] as string;
                              updateRank(index, "fontSize", value);
                            }}
                            classNames={{
                              ...inputClassNames,
                              listboxWrapper: "bg-neutral-800",
                              popoverContent: "bg-neutral-800",
                              label: "text-white",
                              value: "text-white",
                            }}
                          >
                            <SelectItem key="normal" value="normal">
                              Normal
                            </SelectItem>
                            <SelectItem key="large" value="large">
                              Large
                            </SelectItem>
                            <SelectItem key="xl" value="xl">
                              Extra Large
                            </SelectItem>
                          </Select>

                          <Select
                            label="Font Weight"
                            variant="bordered"
                            selectedKeys={[rank.fontWeight]}
                            onSelectionChange={(keys) => {
                              const value = Array.from(keys)[0] as string;
                              updateRank(index, "fontWeight", value);
                            }}
                            classNames={{
                              ...inputClassNames,
                              listboxWrapper: "bg-neutral-800",
                              popoverContent: "bg-neutral-800",
                              label: "text-white",
                              value: "text-white",
                            }}
                          >
                            <SelectItem key="normal" value="normal">
                              Normal
                            </SelectItem>
                            <SelectItem key="bold" value="bold">
                              Bold
                            </SelectItem>
                            <SelectItem key="black" value="black">
                              Black
                            </SelectItem>
                          </Select>
                        </div>

                        {/* Remove Button */}
                        <div className="flex justify-end">
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={() => removeRank(rank.id)}
                            size="sm"
                          >
                            Remove Rank
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button color="default" onPress={addRank}>
                      Add Rank
                    </Button>
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
                                    : t
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
                                    timegoal.id!
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
                                        value
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
      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
        />
      )}
    </Modal>
  );
}