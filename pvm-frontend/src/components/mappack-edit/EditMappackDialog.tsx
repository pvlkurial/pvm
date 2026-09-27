"use client";
import { useState } from "react";
import { Mappack } from "@/types/mappack.types";
import { useEditMappack } from "@/hooks/useEditMappack";
import { mappackEditService } from "@/services/mappack-edit.service";
import { trackService } from "@/services/track.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { BasicInfoTab } from "./BasicInfoTab";
import { TimeGoalsTab } from "./TimeGoalsTab";
import { TiersTab } from "./TiersTab";
import { RanksTab } from "./RanksTab";
import { TrackTimesTab } from "./TrackTimesTab";

interface EditMappackDialogProps {
  mappack: Mappack | null;
  onSave: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface PendingDeletion {
  title: string;
  message: string;
  onConfirm: () => void;
}

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

export function EditMappackDialog({
  mappack,
  onSave,
  isOpen,
  onClose,
}: EditMappackDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion | null>(null);

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
    updateOrderPosition,
    updateTrackTmxId,
    removeTrackFromState,
  } = useEditMappack(mappack, isOpen);

  if (!editData) {
    return null;
  }

  // Tracks are their own records, not part of the mappack payload, so any
  // edited TMX id is persisted separately. Only changed ones are sent.
  const saveChangedTmxIds = () => {
    const changed = editData.MappackTrack.filter((edited) => {
      const original = mappack?.MappackTrack.find(
        (t) => t.track_id === edited.track_id,
      );
      return original && (original.track.tmxID ?? "") !== (edited.track.tmxID ?? "");
    });

    return Promise.all(
      changed.map((t) => trackService.updateTmxId(t.track_id, t.track.tmxID ?? "")),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await mappackEditService.updateMappack(editData);

      try {
        await saveChangedTmxIds();
      } catch (error) {
        // The mappack is already saved at this point, so say so rather than
        // reporting the whole save as failed. The dialog stays open so the TMX
        // edit is not lost.
        console.error("Error updating TMX ID:", error);
        onSave();
        alert(`Mappack saved, but the TMX ID could not be updated: ${errorMessage(error)}`);
        return;
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving mappack:", error);
      alert(`Failed to save mappack: ${errorMessage(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Items that were never saved are just dropped from the form. Saved ones are
   * deleted on the server straight away, after a confirmation.
   */
  const confirmRemoval = (
    id: number | undefined,
    removeFromState: (id: number | undefined) => void,
    deletion: {
      title: string;
      message: string;
      remove: (mappackId: string, id: number) => Promise<void>;
      failure: string;
    },
  ) => {
    if (!id) {
      removeFromState(id);
      return;
    }

    setPendingDeletion({
      title: deletion.title,
      message: deletion.message,
      onConfirm: async () => {
        try {
          await deletion.remove(editData.id, id);
          removeFromState(id);
        } catch (error) {
          console.error(`${deletion.failure}:`, error);
          alert(deletion.failure);
        }
      },
    });
  };

  const handleRemoveTimeGoal = (id: number | undefined) =>
    confirmRemoval(id, removeTimeGoalFromState, {
      title: "Delete Time Goal",
      message:
        "This will permanently delete this time goal and all associated player achievements. This action cannot be undone.",
      remove: mappackEditService.deleteTimeGoal,
      failure: "Failed to delete time goal",
    });

  const handleRemoveTier = (id: number | undefined) =>
    confirmRemoval(id, removeTierFromState, {
      title: "Delete Tier",
      message:
        "This will remove this tier. Tracks assigned to this tier will become unranked.",
      remove: mappackEditService.deleteTier,
      failure: "Failed to delete tier",
    });

  const handleRemoveRank = (id: number | undefined) =>
    confirmRemoval(id, removeRankFromState, {
      title: "Delete Rank",
      message:
        "This will permanently delete this rank. Players with this rank will be re-assigned based on their points.",
      remove: mappackEditService.deleteRank,
      failure: "Failed to delete rank",
    });

  const handleDeleteTrack = (trackId: string, trackName: string) => {
    setPendingDeletion({
      title: "Delete Track",
      message: `Are you sure you want to remove "${trackName}" from this mappack? This will delete all time goals and tier assignments for this track.`,
      onConfirm: async () => {
        try {
          await mappackEditService.deleteTrack(editData.id, trackId);
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
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Edit Mappack</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="flex min-h-0 flex-1 flex-col">
            <div className="px-6 pb-4">
              <TabsList className="max-w-full overflow-x-auto">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="timegoals">Time Goals</TabsTrigger>
                <TabsTrigger value="tiers">Tiers</TabsTrigger>
                <TabsTrigger value="ranks">Ranks</TabsTrigger>
                <TabsTrigger value="tracks">Track Times</TabsTrigger>
              </TabsList>
            </div>

            <DialogBody className="pb-6">
              <TabsContent value="basic">
                <BasicInfoTab
                  editData={editData}
                  onUpdate={(updates) => setEditData({ ...editData, ...updates })}
                />
              </TabsContent>

              <TabsContent value="timegoals">
                <TimeGoalsTab
                  timeGoals={editData.timeGoals}
                  onAdd={addTimeGoal}
                  onUpdate={updateTimeGoal}
                  onRemove={handleRemoveTimeGoal}
                />
              </TabsContent>

              <TabsContent value="tiers">
                <TiersTab
                  tiers={editData.mappackTiers}
                  tracks={editData.MappackTrack}
                  onAddTier={addTier}
                  onUpdateTier={updateTier}
                  onRemoveTier={handleRemoveTier}
                  onAssignTier={assignTierToTrack}
                />
              </TabsContent>

              <TabsContent value="ranks">
                <RanksTab
                  ranks={editData.mappackRanks}
                  onAdd={addRank}
                  onUpdate={updateRank}
                  onRemove={handleRemoveRank}
                />
              </TabsContent>

              <TabsContent value="tracks">
                <TrackTimesTab
                  tracks={editData.MappackTrack}
                  timeGoals={editData.timeGoals}
                  timeInputValues={timeInputValues}
                  onUpdateTrackTime={updateTrackTime}
                  onUpdateMapStyle={updateMapStyle}
                  onUpdateOrderPosition={updateOrderPosition}
                  onUpdateTmxId={updateTrackTmxId}
                  onDeleteTrack={handleDeleteTrack}
                />
              </TabsContent>
            </DialogBody>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={isSaving}>
              Save All Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {pendingDeletion && (
        <ConfirmDialog
          isOpen
          onClose={() => setPendingDeletion(null)}
          onConfirm={pendingDeletion.onConfirm}
          title={pendingDeletion.title}
          message={pendingDeletion.message}
          confirmText="Delete"
          isDangerous
        />
      )}
    </>
  );
}
