import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      classNames={{
        base: "bg-neutral-800",
        header: "bg-neutral-800 text-white border-b border-white/10",
        body: "bg-neutral-800 text-white",
        footer: "bg-neutral-800 border-t border-white/10",
        closeButton: "text-white hover:bg-neutral-700",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-2xl font-ruigslay">{title}</ModalHeader>
            <ModalBody>
              <p className="text-white/90">{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="bordered" onPress={onClose}>
                {cancelText}
              </Button>
              <Button color={isDangerous ? "danger" : "default"} onPress={handleConfirm}>
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}