import { Button, Card, CardHeader, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@heroui/react";

export default function AddTrackModal({ timegoals }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div>
      <Button color="default" variant="bordered" onPress={onOpen}>
        Add New Track
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        classNames={{
          base: "bg-neutral-800", // dark background
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
                  <Input
                    label="Track UUID"
                    placeholder="example: d2b8a048-209d-4cfa-b5a4-bc3e3cab3566"
                    variant="bordered"
                    classNames={{
                      input: "text-white",
                      inputWrapper:
                        "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:border-white",
                    }}
                  />
                  <Input
                    label="Tier"
                    placeholder="A / B / C / S / ..."
                    variant="bordered"
                    classNames={{
                      input: "text-white",
                      inputWrapper:
                        "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:border-white",
                    }}
                  />
                  <div className="flex flex-col gap-1">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2 ">
                      <p className="text-xl font-ruigslay">Time Goals</p>
                      <div className="flex-1 h-[5px] bg-neutral-300"></div>
                    </div>
                    {timegoals.map((timegoal) => (
                      <Input
                        label={timegoal.name}
                        placeholder="0:59:328"
                        variant="bordered"
                        classNames={{
                          input: "text-white",
                          inputWrapper:
                            "border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:border-white",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex py-2 px-1 justify-between"></div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
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
