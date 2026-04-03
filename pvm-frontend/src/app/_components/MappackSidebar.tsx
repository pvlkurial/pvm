import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import AddTrackModal from "@/app/_components/add-edit-buttons/AddTrackModal";
import { EditMappackModal } from "@/app/_components/add-edit-buttons/EditMappackModal";
import RequireRole from "@/app/_components/RequireRole";
import { Mappack, MappackTier, MappackTrack } from "@/types/mappack.types";
import { FaDiscord, FaGlobe, FaTable } from "react-icons/fa6";

interface MappackSidebarProps {
  mappack: Mappack;
  sortedTiers: string[];
  tracksByTier: Record<
    string,
    { tier: MappackTier | null; tracks: MappackTrack[] }
  >;
  activeTier: string;
  selectedTab: string;
  isEditOpen: boolean;
  onTierClick: (tier: string) => void;
  onEditClick: () => void;
  onEditClose: () => void;
  onEditSave: () => void;
}

export function MappackSidebar({
  mappack,
  sortedTiers,
  tracksByTier,
  activeTier,
  selectedTab,
  isEditOpen,
  onTierClick,
  onEditClick,
  onEditClose,
  onEditSave,
}: MappackSidebarProps) {
  const sortedTimeGoals = mappack.timeGoals.sort((a, b) => {
    const multA = a.multiplier ?? 0;
    const multB = b.multiplier ?? 0;
    return multA - multB;
  });

  return (
    <div className="bg-white-900 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto scrollbar-hide scrollbar-thumb-gray-600 scrollbar-track-transparent">
      <div className="flex flex-col gap-4 p-4">
        <div className="bg-white-900 lg:sticky lg:top-4 lg:self-start">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-center items-center">
              <Popover placement="right">
                <PopoverTrigger>
                  <button className="font-bold text-3xl font-ruigslay overline hover:opacity-80 transition-opacity cursor-pointer">
                    {mappack.name.toUpperCase()}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="bg-zinc-900 border border-white/20 text-white p-4">
                  <div className="w-56 flex flex-col gap-3">
                    <p className="text-white/70 text-sm text-center break-words whitespace-normal overflow-hidden">
                      {mappack.description}
                    </p>
                    <div className="flex gap-2 w-full">
                      {mappack.sheeturl && (
                        <a
                          href={mappack.sheeturl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost text-sm flex items-center justify-center gap-1 flex-1"
                        >
                          <FaTable />
                        </a>
                      )}
                      {mappack.discordurl && (
                        <a
                          href={mappack.discordurl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost text-sm flex items-center justify-center gap-1 flex-1"
                        >
                          <FaDiscord />
                        </a>
                      )}
                      {mappack.websiteurl && (
                        <a
                          href={mappack.websiteurl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost text-sm flex items-center justify-center gap-1 flex-1"
                        >
                          <FaGlobe />
                        </a>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <hr className="divider" />

            <div className="flex justify-center items-center">
              <p className="text-lg font-ruigslay">Timegoals</p>
            </div>
            {sortedTimeGoals.map((timeGoal) => (
              <div
                key={timeGoal.name}
                className="flex justify-center items-center font-bold text-white/80 tracking-wider"
              >
                <p className="text-bold uppercase text-sm">
                  {timeGoal.name} {timeGoal.multiplier}x
                </p>
              </div>
            ))}

            {selectedTab === "maps" && (
              <>
                <div className="border-t border-gray-700 pt-4">
                  <p className="font-semibold text-lg mb-2 text-center font-ruigslay">
                    Tiers
                  </p>
                  {sortedTiers.map((tierName) => {
                    const tierData = tracksByTier[tierName];
                    const tierColor = tierData.tier?.color || "#6b7280";

                    return (
                      <button
                        key={tierName}
                        onClick={() => onTierClick(tierName)}
                        style={{
                          backgroundColor:
                            activeTier === tierName ? tierColor : "transparent",
                        }}
                        className={`w-full py-2 px-4 rounded-lg transition-all duration-200 ${
                          activeTier === tierName
                            ? "text-white font-semibold"
                            : "text-gray-300 hover:opacity-80"
                        }`}
                      >
                        {tierName.toUpperCase()} TIER ({tierData.tracks.length})
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-center items-center">
                  <RequireRole role="admin">
                    <AddTrackModal
                      timegoals={mappack.timeGoals}
                      mappackId={mappack.id}
                    />
                  </RequireRole>
                </div>
              </>
            )}

            <div className="flex justify-center items-center">
              <RequireRole role="admin">
                <Button onPress={onEditClick}>Edit Mappack</Button>
                <EditMappackModal
                  mappack={mappack}
                  isOpen={isEditOpen}
                  onClose={onEditClose}
                  onSave={onEditSave}
                />
              </RequireRole>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
