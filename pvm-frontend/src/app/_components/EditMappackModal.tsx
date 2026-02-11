"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
} from "@heroui/react";
import { useState } from "react";
import { Mappack } from "@/types/mappack.types";
import { useEditMappack } from "@/hooks/useEditMappack";
import { mappackEditService } from "@/services/mappack-edit.service";
import { ConfirmDialog } from "./ConfirmDialog";
import { BasicInfoTab } from "./mappack-edit/BasicInfoTab";
import { TimeGoalsTab } from "./mappack-edit/TimeGoalsTab";
import { TiersTab } from "./mappack-edit/TiersTab";
import { RanksTab } from "./mappack-edit/RanksTab";
import { TrackTimesTab } from "./mappack-edit/TrackTimesTab";
import { MODAL_INPUT_CLASSNAMES, MODAL_CLASSNAMES, TAB_CLASSNAMES } from "@/constants/modal-styles";

interface EditMappackModalProps {
  mappack: Mappack | null;
  onSave: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export function EditMappackModal({
  mappack,
  onSave,
  isOpen,
  onClose,
}: EditMappackModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);

  const {
    editData,
    setEditData,
    timeInputValues,
    addTimeGoal,
    updateTimeGoal,
    removeTimeGoalFromState,
    addTier,
    updateTier,
    removeTierFromState,
    addRank,
    updateRank,
    removeRankFromState,
    assignTierToTrack,
    updateTrackTime,
    updateMapStyle,
    removeTrackFromState,
  } = useEditMappack(mappack, isOpen);

  if (!editData) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await mappackEditService.updateMappack(editData);
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving mappack:", error);
      alert(
        `Failed to save mappack: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveTimeGoal = async (id: number | undefined) => {
    if (!id) {
      removeTimeGoalFromState(id);
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: "Delete Time Goal",
      message: "This will permanently delete this time goal and all associated player achievements. This action cannot be undone.",
      onConfirm: async () => {
        try {
          await mappackEditService.deleteTimeGoal(editData.id, id);
          removeTimeGoalFromState(id);
        } catch (error) {
          console.error("Error deleting time goal:", error);
          alert("Failed to delete time goal");
        }
      },
    });
  };

  const handleRemoveTier = async (id: number | undefined) => {
    if (!id) {
      removeTierFromState(id);
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: "Delete Tier",
      message: "This will remove this tier. Tracks assigned to this tier will become unranked.",
      onConfirm: async () => {
        try {
          await mappackEditService.deleteTier(editData.id, id);
          removeTierFromState(id);
        } catch (error) {
          console.error("Error deleting tier:", error);
          alert("Failed to delete tier");
        }
      },
    });
  };

  const handleRemoveRank = async (id: number | undefined) => {
    if (!id) {
      removeRankFromState(id);
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: "Delete Rank",
      message: "This will permanently delete this rank. Players with this rank will be re-assigned based on their points.",
      onConfirm: async () => {
        try {
          await mappackEditService.deleteRank(editData.id, id);
          removeRankFromState(id);
        } catch (error) {
          console.error("Error deleting rank:", error);
          alert("Failed to delete rank");
        }
      },
    });
  };

  const handleDeleteTrack = (trackId: string, trackName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Track",
      message: `Are you sure you want to remove "${trackName}" from this mappack? This will delete all time goals and tier assignments for this track.`,
      onConfirm: async () => {
        try {
          await mappackEditService.deleteTrack(editData!.id, trackId);
          removeTrackFromState(trackId);
        } catch (error) {
          console.error("Error deleting track:", error);
          alert("Failed to delete track");
        }
      },
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        placement="top-center"
        size="5xl"
        scrollBehavior="inside"
        classNames={MODAL_CLASSNAMES}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-4xl font-ruigslay items-center">
                Edit Mappack
              </ModalHeader>
              <ModalBody>
                <Tabs classNames={TAB_CLASSNAMES}>
                  <Tab key="basic" title="Basic Info">
                    <BasicInfoTab
                      editData={editData}
                      onUpdate={(updates) => setEditData({ ...editData, ...updates })}
                      inputClassNames={MODAL_INPUT_CLASSNAMES}
                    />
                  </Tab>

                  <Tab key="timegoals" title="Time Goals">
                    <TimeGoalsTab
                      timeGoals={editData.timeGoals}
                      onAdd={addTimeGoal}
                      onUpdate={updateTimeGoal}
                      onRemove={handleRemoveTimeGoal}
                      inputClassNames={MODAL_INPUT_CLASSNAMES}
                    />
                  </Tab>

                  <Tab key="tiers" title="Tiers">
                    <TiersTab
                      tiers={editData.mappackTiers}
                      tracks={editData.MappackTrack}
                      onAddTier={addTier}
                      onUpdateTier={updateTier}
                      onRemoveTier={handleRemoveTier}
                      onAssignTier={assignTierToTrack}
                      inputClassNames={MODAL_INPUT_CLASSNAMES}
                    />
                  </Tab>

                  <Tab key="ranks" title="Ranks">
                    <RanksTab
                      ranks={editData.mappackRanks}
                      onAdd={addRank}
                      onUpdate={updateRank}
                      onRemove={handleRemoveRank}
                      inputClassNames={MODAL_INPUT_CLASSNAMES}
                    />
                  </Tab>

                  <Tab key="tracks" title="Track Times">
                    <TrackTimesTab
                      tracks={editData.MappackTrack}
                      timeGoals={editData.timeGoals}
                      timeInputValues={timeInputValues}
                      onUpdateTrackTime={updateTrackTime}
                      onUpdateMapStyle={updateMapStyle}
                      onDeleteTrack={handleDeleteTrack}
                      inputClassNames={MODAL_INPUT_CLASSNAMES}
                    />
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
    </>
  );
}