import { Button } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { TimeGoal } from "@/types/mappack.types";
import { useAddTrackForm } from "@/hooks/useAddTrackForm";
import { trackService } from "@/services/track.service";
import { TrackIdInput } from "./add-track/TrackIdInput";
import { TimeGoalsInput } from "./add-track/TimeGoalsInput";
import { MODAL_INPUT_CLASSNAMES } from "@/constants/modal-styles";

interface AddTrackModalProps {
  timegoals: TimeGoal[];
  mappackId: string;
}

export default function AddTrackModal({
  timegoals,
  mappackId,
}: AddTrackModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    trackUuid,
    tmxId,
    timeGoalValues,
    selectedTab,
    isLoading,
    setTrackUuid,
    setTmxId,
    setSelectedTab,
    setIsLoading,
    handleTimeGoalChange,
    getTrackId,
    getTimeGoalsWithValues,
    resetForm,
    validateForm,
  } = useAddTrackForm();

  const handleAddTrack = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      setIsLoading(true);
      const trackId = getTrackId();

      await trackService.addToMappack({
        mappackId,
        trackId,
        tmxId,
      });

      const timeGoalsWithValues = getTimeGoalsWithValues(timegoals);
      await trackService.addTimeGoals(mappackId, trackId, timeGoalsWithValues);

      await trackService.fetchRecords(trackId);

      resetForm();
      onOpenChange();
      window.location.reload();
    } catch (error) {
      console.error("Error adding track:", error);
      alert("Failed to add track. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white"
        onPress={onOpen}
      >
        Add New Track
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        size="4xl"
        scrollBehavior="inside"
        classNames={{
          base: "bg-neutral-900",
          header: "border-b border-white/10",
          body: "py-6",
          footer: "border-t border-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-white">Add Track to Mappack</h2>
              </ModalHeader>
              <ModalBody className="gap-6">
                <TrackIdInput
                  selectedTab={selectedTab}
                  trackUuid={trackUuid}
                  tmxId={tmxId}
                  onTabChange={setSelectedTab}
                  onUuidChange={setTrackUuid}
                  onTmxIdChange={setTmxId}
                  inputClassNames={MODAL_INPUT_CLASSNAMES}
                />

                <TimeGoalsInput
                  timeGoals={timegoals}
                  timeGoalValues={timeGoalValues}
                  onTimeGoalChange={handleTimeGoalChange}
                  inputClassNames={MODAL_INPUT_CLASSNAMES}
                />
              </ModalBody>
              <ModalFooter className="gap-2">
                <Button
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white"
                  onPress={onClose}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
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