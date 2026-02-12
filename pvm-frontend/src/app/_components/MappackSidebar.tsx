import { Button } from "@heroui/react";
import AddTrackModal from "@/app/_components/AddTrackModal";
import { EditMappackModal } from "@/app/_components/EditMappackModal";
import RequireRole from "@/app/_components/RequireRole";
import { Mappack, MappackTier, MappackTrack } from "@/types/mappack.types";

interface MappackSidebarProps {
  mappack: Mappack;
  sortedTiers: string[];
  tracksByTier: Record<string, { tier: MappackTier | null; tracks: MappackTrack[] }>;
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
  return (
    <div className="bg-white-900 lg:sticky lg:top-4 lg:self-start">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-center items-center">
          <p className="font-bold text-3xl font-ruigslay overline">
            {mappack.name.toUpperCase()}
          </p>
        </div>

        <div className="flex justify-center items-center">
          <p className="font-bold text-sm">{mappack.description}</p>
        </div>

        <hr />

        <div className="flex justify-center items-center">
          <p className="text-lg font-ruigslay">Timegoals</p>
        </div>
        {mappack.timeGoals.map((timeGoal) => (
          <div key={timeGoal.name} className="flex justify-center items-center">
            <p className="text-bold">{timeGoal.name}</p>
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
  );
}