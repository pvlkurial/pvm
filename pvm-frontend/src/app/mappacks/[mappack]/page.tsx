// app/mappack/[mappack]/page.tsx
"use client";
import { use, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Mappack, MappackTrack } from "@/types/mappack.types";
import { mappackService } from "@/services/mappack.service";
import { groupTracksByTier, sortTiersByPoints } from "@/utils/mappack.utils";
import { useTierScroll } from "@/hooks/useTierScroll";
import { MappackSidebar } from "@/app/_components/MappackSidebar";
import { MappackContent } from "@/app/_components/MappackContent";
import { PlayerStats } from "@/app/_components/PlayerStats";

export default function MappackPage({
  params,
}: {
  params: Promise<{ mappack: string }>;
}) {
  const { mappack: mappackId } = use(params);
  const { user } = useAuth();
  const [mappack, setMappack] = useState<Mappack | null>(null);
  const [filteredTracks, setFilteredTracks] = useState<MappackTrack[]>([]);
  const [selectedTab, setSelectedTab] = useState("maps");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tierSortOrder, setTierSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchMappack = async () => {
      try {
        setLoading(true);
        const data = await mappackService.getMappack(mappackId, user?.id);
        setMappack(data);
        setFilteredTracks(data.MappackTrack);
      } catch (error) {
        console.error("Error fetching mappack:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMappack();
  }, [mappackId, user?.id]);

  const tracksByTier = groupTracksByTier(filteredTracks);
  const sortedTiers = sortTiersByPoints(tracksByTier, tierSortOrder);

  const { activeTier, tierRefs, scrollToTier } = useTierScroll(tracksByTier);

  const handleEditSave = async () => {
    try {
      const data = await mappackService.getMappack(mappackId, user?.id);
      setMappack(data);
      setFilteredTracks(data.MappackTrack);
    } catch (error) {
      console.error("Error reloading mappack:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white text-xl font-ruigslay animate-pulse">Loading mappack...</p>
      </div>
    );
  }

  if (!mappack) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white text-xl">Mappack not found</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-rows-1 lg:grid-cols-6 gap-10">
      <div className="lg:col-start-1 lg:col-span-1 col-span-1">
        <MappackSidebar
          mappack={mappack}
          sortedTiers={sortedTiers}
          tracksByTier={tracksByTier}
          activeTier={activeTier}
          selectedTab={selectedTab}
          isEditOpen={isEditOpen}
          onTierClick={scrollToTier}
          onEditClick={() => setIsEditOpen(true)}
          onEditClose={() => setIsEditOpen(false)}
          onEditSave={handleEditSave}
        />
      </div>
      <MappackContent
        mappack={mappack}
        sortedTiers={sortedTiers}
        tracksByTier={tracksByTier}
        filteredTracks={filteredTracks}
        onFilterChange={setFilteredTracks}
        onSortOrderChange={setTierSortOrder}
        onTabChange={setSelectedTab}
        tierRefs={tierRefs}
        playerId={user?.id}
      />
      {user?.id && (
        <PlayerStats
          mappackId={mappackId}
          playerId={user.id}
          totalTracks={mappack.MappackTrack.length}
          totalTimeGoals={mappack.timeGoals.length}
          ranks={mappack.mappackRanks}
        />
      )}
    </div>
  );
}