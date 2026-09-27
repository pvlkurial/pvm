"use client";
import { useState } from "react";
import { TimeGoal } from "@/types/mappack.types";
import { useAddTrackForm } from "@/hooks/useAddTrackForm";
import { trackService } from "@/services/track.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrackIdInput } from "./TrackIdInput";
import { TimeGoalsInput } from "./TimeGoalsInput";

interface AddTrackDialogProps {
  timegoals: TimeGoal[];
  mappackId: string;
}

export function AddTrackDialog({ timegoals, mappackId }: AddTrackDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useAddTrackForm();

  const handleAddTrack = async () => {
    const error = form.validate();
    if (error) {
      alert(error);
      return;
    }

    const trackId = form.trackUuid;
    try {
      form.setIsLoading(true);
      await trackService.addToMappack({ mappackId, trackId, tmxId: form.tmxId });
      await trackService.addTimeGoals(
        mappackId,
        trackId,
        form.getTimeGoalsWithValues(timegoals),
      );
      await trackService.fetchRecords(trackId);

      form.resetForm();
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding track:", error);
      alert("Failed to add track. Please try again.");
    } finally {
      form.setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add New Track
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Track to Mappack</DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-6 pb-6">
          <TrackIdInput
            trackUuid={form.trackUuid}
            tmxId={form.tmxId}
            onUuidChange={form.setTrackUuid}
            onTmxIdChange={form.setTmxId}
          />
          <TimeGoalsInput
            timeGoals={timegoals}
            timeGoalValues={form.timeGoalValues}
            onTimeGoalChange={form.handleTimeGoalChange}
          />
        </DialogBody>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={form.isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleAddTrack} loading={form.isLoading}>
            Add Track
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
