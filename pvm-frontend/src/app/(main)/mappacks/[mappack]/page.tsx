"use client";
import { use, useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mappack, MappackTrack } from "@/types/mappack.types";
import { mappackService } from "@/services/mappack.service";
import { mappackCache } from "@/services/mappack.cache";
import { groupTracksByTier, sortTiersByPoints } from "@/utils/mappack.utils";
import { useTierScroll } from "@/hooks/useTierScroll";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useStoredState } from "@/hooks/useStoredState";
import { useSidebarTitleHeight } from "@/hooks/useSidebarTitleHeight";
import { PageStatus } from "@/components/common/PageStatus";
import { MappackSidebar } from "@/components/mappack/MappackSidebar";
import { MappackContent, MappackTab } from "@/components/mappack/MappackContent";
import { SortOrder } from "@/components/mappack/TierSortButton";
import { PlayerStats } from "@/components/player-stats/PlayerStats";

export default function MappackPage({
  params,
}: {
  params: Promise<{ mappack: string }>;
}) {
  const { mappack: mappackId } = use(params);
  const { user } = useAuth();
  const pathName = usePathname();
  const gridRef = useSidebarTitleHeight<HTMLDivElement>();
  const cacheKey = mappackCache.key(mappackId, user?.id);
  const cached = mappackCache.get(cacheKey);
  const [mappack, setMappack] = useState<Mappack | null>(cached ?? null);
  const [filteredTracks, setFilteredTracks] = useState<MappackTrack[]>(
    cached?.MappackTrack ?? [],
  );
  const [selectedTab, setSelectedTab] = useState<MappackTab>("maps");
  const [loading, setLoading] = useState(!cached);
  const [tierSortOrder, setTierSortOrder] = useStoredState<SortOrder>(
    "tier-sort-order",
    "asc",
    (raw) => raw as SortOrder,
  );

  // Mappack and track list are set together: the track filter re-applies
  // itself after the list changes, which a separate effect would undo.
  const showMappack = (data: Mappack) => {
    setMappack(data);
    setFilteredTracks(data.MappackTrack);
  };

  const fetchMappack = async () => {
    const data = await mappackService.getMappack(mappackId, user?.id);
    mappackCache.set(cacheKey, data);
    return data;
  };

  useEffect(() => {
    let cancelled = false;

    // A cached copy shows immediately (the first render already has it) and
    // the fetch below only refreshes it.
    if (cached && cached !== mappack) showMappack(cached);
    setLoading(!cached);

    fetchMappack()
      .then((data) => !cancelled && showMappack(data))
      .catch((error) => console.error("Error fetching mappack:", error))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  const handleEditSave = () => {
    fetchMappack()
      .then(showMappack)
      .catch((error) => console.error("Error reloading mappack:", error));
  };

  const tracksByTier = useMemo(
    () => groupTracksByTier(filteredTracks),
    [filteredTracks],
  );
  const sortedTiers = sortTiersByPoints(tracksByTier, tierSortOrder);
  const { isRestored } = useScrollPosition(pathName, !loading);
  const { activeTier, tierRefs, scrollToTier } = useTierScroll(
    tracksByTier,
    isRestored,
  );

  if (loading) {
    return <PageStatus pending>Loading mappack...</PageStatus>;
  }

  if (!mappack) {
    return <PageStatus>Mappack not found</PageStatus>;
  }

  return (
    <div ref={gridRef} className="grid gap-10 lg:grid-cols-6">
      <MappackSidebar
        mappack={mappack}
        sortedTiers={sortedTiers}
        tracksByTier={tracksByTier}
        activeTier={activeTier}
        showTiers={selectedTab === "maps"}
        onTierClick={scrollToTier}
        onEditSave={handleEditSave}
      />
      <MappackContent
        mappack={mappack}
        sortedTiers={sortedTiers}
        tracksByTier={tracksByTier}
        onFilterChange={setFilteredTracks}
        tierSortOrder={tierSortOrder}
        onTierSortOrderChange={setTierSortOrder}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        tierRefs={tierRefs}
        playerId={user?.id}
      />
      {user?.id && (
        <PlayerStats
          mappackId={mappackId}
          playerId={user.id}
          totalTracks={mappack.MappackTrack.length}
          ranks={mappack.mappackRanks}
          accentColor={mappack.accentColor}
        />
      )}
    </div>
  );
}
