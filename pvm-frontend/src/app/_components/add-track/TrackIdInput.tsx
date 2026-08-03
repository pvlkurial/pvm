import { Button, Input, Tab, Tabs, Spinner } from "@heroui/react";
import { useState } from "react";
import { TmxTrack } from "@/types/tmx.types";
import { tmxService } from "@/services/tmx.service";
import { IoSearch } from "react-icons/io5";
import { SectionHeading } from "../SectionHeading";
import { TAB_CLASSNAMES } from "@/constants/modal-styles";
import { ADMIN_BUTTON } from "@/constants/button-styles";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TmxTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TmxTrack | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await tmxService.searchTracks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTrack = (track: TmxTrack) => {
    setSelectedTrack(track);
    onUuidChange(track.MapUUID);
    onTmxIdChange(track.TrackID.toString());
  };

  return (
    <>
      <SectionHeading>Track Info</SectionHeading>

      <Tabs
        aria-label="Track ID Input Method"
        size="md"
        selectedKey={selectedTab}
        onSelectionChange={(key) => onTabChange(key as string)}
        classNames={TAB_CLASSNAMES}
      >
        <Tab key="search" title="TMX Search">
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex gap-2">
              <Input
                label="Search Track Name"
                placeholder="Enter track name..."
                variant="bordered"
                value={searchQuery}
                onValueChange={setSearchQuery}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                classNames={inputClassNames}
              />
              <Button
                onPress={handleSearch}
                isDisabled={isSearching || !searchQuery.trim()}
                isIconOnly
                className={`mt-6 h-[56px] w-14 shrink-0 ${ADMIN_BUTTON}`}
              >
                {isSearching ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <IoSearch className="w-5 h-5" />
                )}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                {searchResults.map((track) => (
                  <div
                    key={track.TrackID}
                    onClick={() => handleSelectTrack(track)}
                    className={`
                      p-4 rounded-lg border cursor-pointer
                      transition-all duration-200
                      ${
                        selectedTrack?.TrackID === track.TrackID
                          ? "bg-white/15 border-white/40"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }
                      `}
                  >
                    <div className="flex items-center gap-4">
                      {track.ThumbnailURL ? (
                        <img
                          src={track.ThumbnailURL}
                          alt={track.Name}
                          loading="lazy"
                          className="w-24 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-24 h-16 bg-white/5 rounded flex items-center justify-center">
                          <span className="text-white/30 text-xs">
                            No image
                          </span>
                        </div>
                      )}

                      <div className="flex-1">
                        <h4 className="text-white font-semibold">
                          {track.Name}
                        </h4>
                        <p className="text-white/60 text-sm">
                          by {track.AuthorName}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          TMX ID: {track.TrackID}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tab>
        <Tab key="uuid" title="Manual Input">
          <div className="flex flex-col gap-4 pt-4">
            <Input
              label="Track UUID"
              placeholder="a282e3f9-5585-4edf-9db1-c370ff1190d9"
              variant="bordered"
              value={trackUuid}
              onValueChange={onUuidChange}
              classNames={inputClassNames}
            />
            <Input
              label="TMX ID"
              placeholder="123456"
              variant="bordered"
              value={tmxId}
              onValueChange={onTmxIdChange}
              classNames={inputClassNames}
            />
          </div>
        </Tab>
      </Tabs>
    </>
  );
}
