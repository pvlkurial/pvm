import { Input, Tab, Tabs } from "@heroui/react";

interface TrackIdInputProps {
  selectedTab: string;
  trackUuid: string;
  tmxId: string;
  onTabChange: (key: string) => void;
  onUuidChange: (value: string) => void;
  onTmxIdChange: (value: string) => void;
  inputClassNames: any;
}

export function TrackIdInput({
  selectedTab,
  trackUuid,
  tmxId,
  onTabChange,
  onUuidChange,
  onTmxIdChange,
  inputClassNames,
}: TrackIdInputProps) {
  return (
    <>
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <p className="text-xl font-ruigslay">Track Info</p>
        <div className="flex-1 h-[5px] bg-neutral-300"></div>
      </div>

      <Tabs
        aria-label="Track ID Input Method"
        size="md"
        selectedKey={selectedTab}
        onSelectionChange={(key) => onTabChange(key as string)}
        classNames={{
          tabList: "bg-neutral-700",
          cursor: "bg-blue-400",
          tab: "data-[selected=true]:bg-neutral-400 data-[selected=true]:!text-white",
          tabContent: "group-data-[selected=true]:text-white",
        }}
      >
        <Tab key="uuid" title="UUID">
          <Input
            label="Track UUID"
            placeholder="d2b8a048-209d-4cfa-b5a4-bc3e3cab3566"
            variant="bordered"
            value={trackUuid}
            onValueChange={onUuidChange}
            classNames={inputClassNames}
          />
        </Tab>
        <Tab key="tmxid" title="TMX ID">
          <Input
            label="TMX ID"
            placeholder="170211"
            variant="bordered"
            value="DOESNT WORK YET"
            onValueChange={onTmxIdChange}
            classNames={inputClassNames}
          />
        </Tab>
        <Tab key="search" title="TMX Search">
          <p className="text-gray-400 italic py-4">Coming soon...</p>
        </Tab>
      </Tabs>
    </>
  );
}