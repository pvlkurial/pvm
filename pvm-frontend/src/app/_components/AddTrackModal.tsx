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
import { MODAL_INPUT_CLASSNAMES, MODAL_CLASSNAMES } from "@/constants/modal-styles";

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
        color="default"
        variant="bordered"
        onPress={onOpen}
      >
        Add New Track
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        size="2xl"
        classNames={MODAL_CLASSNAMES}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl font-ruigslay">
                Add Track to Mappack
              </ModalHeader>
              <ModalBody>
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