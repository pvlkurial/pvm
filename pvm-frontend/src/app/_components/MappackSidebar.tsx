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
  const sortedTimeGoals = [...mappack.timeGoals].sort(
    (a, b) => (a.multiplier ?? 0) - (b.multiplier ?? 0)
  );

  return (
    <div className="lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-5 p-4">
        <div className="flex justify-center">
          <Popover placement="right">
            <PopoverTrigger>
              <button className="font-bold text-5xl font-ruigslay hover:opacity-80 transition-opacity cursor-pointer pt-3">
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

        <hr className="border-white/10" />

        <div>
          <p className="text-lg font-ruigslay text-white uppercase tracking-wider text-center mb-2">
            Timegoals
          </p>
          <div className="flex flex-col gap-1">
            {sortedTimeGoals.map((timeGoal) => (
              <div
                key={timeGoal.name}
                className="flex justify-center items-center gap-1.5 text-sm"
              >
                <span className="uppercase tracking-wide text-white/80 font-semibold">
                  {timeGoal.name}
                </span>
                <span className="text-white/40">{timeGoal.multiplier}x</span>
              </div>
            ))}
          </div>
        </div>

        {selectedTab === "maps" && (
          <>
            <hr className="border-white/10" />

            <div>
              <p className="text-lg font-ruigslay text-white uppercase tracking-wider text-center mb-2">
                Tiers
              </p>
              <div className="flex flex-col gap-1">
                {sortedTiers.map((tierName) => {
                  const tierData = tracksByTier[tierName];
                  const tierColor = tierData.tier?.color || "#6b7280";
                  const isActive = activeTier === tierName;

                  return (
                    <button
                      key={tierName}
                      onClick={() => onTierClick(tierName)}
                      style={{
                        backgroundColor: isActive ? `${tierColor}90` : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = `${tierColor}1a`;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      className={`w-full text-sm py-1.5 px-2 rounded-md transition-colors duration-150 cursor-pointer ${
                        isActive ? "font-semibold" : "text-white/50"
                      }`}
                    >
                      {tierName.toUpperCase()} ({tierData.tracks.length})
                    </button>
                  );
                })}
              </div>

              <RequireRole role="admin">
                <div className="flex justify-center mt-3">
                  <AddTrackModal
                    timegoals={mappack.timeGoals}
                    mappackId={mappack.id}
                  />
                </div>
              </RequireRole>
            </div>
          </>
        )}

        <RequireRole role="admin">
          <hr className="border-white/10" />
          <div className="flex justify-center">
            <Button onPress={onEditClick} size="sm" variant="flat">
              Edit Mappack
            </Button>
            <EditMappackModal
              mappack={mappack}
              isOpen={isEditOpen}
              onClose={onEditClose}
              onSave={onEditSave}
            />
          </div>
        </RequireRole>
      </div>
    </div>
  );
}