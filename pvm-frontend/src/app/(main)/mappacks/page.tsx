"use client";
import { useState, useEffect } from "react";
import { Mappack } from "@/types/mappack.types";
import { mappackService } from "@/services/mappack.service";
import { usePermissions } from "@/hooks/usePermissions";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MappackGrid } from "@/components/mappacks/MappackGrid";

type Listing = "all" | "pvm" | "campaign";

export default function MappacksPage() {
  const [mappacks, setMappacks] = useState<Mappack[]>([]);
  const [campaigns, setCampaigns] = useState<Mappack[]>([]);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<Listing>("all");
  // Only superadmins may create mappacks; admins are scoped to their grants.
  const { canCreateMappack } = usePermissions();

  useEffect(() => {
    // Settled rather than all: one endpoint failing must not blank the other.
    Promise.allSettled([
      mappackService.listMappacks(),
      mappackService.listCampaigns(),
    ])
      .then(([mappackResult, campaignResult]) => {
        if (mappackResult.status === "fulfilled") {
          setMappacks(mappackResult.value);
        } else {
          console.log("Failed to load mappacks:", mappackResult.reason?.message);
        }

        if (campaignResult.status === "fulfilled") {
          setCampaigns(campaignResult.value);
        } else {
          console.log("Failed to load campaigns:", campaignResult.reason?.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-7 pt-9 pb-18">
      <Tabs value={listing} onValueChange={(value) => setListing(value as Listing)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pvm">PvM</TabsTrigger>
          <TabsTrigger value="campaign">Campaign</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-16">
      {listing !== "campaign" && (
        <MappackGrid
          title="PvM"
          mappacks={mappacks}
          showAddCard={canCreateMappack}
          isLoading={loading}
          emptyMessage="No mappacks yet"
        />
      )}

      {listing !== "pvm" && (listing === "campaign" || campaigns.length > 0) && (
        <MappackGrid
          title="Campaign"
          mappacks={campaigns}
          isLoading={loading}
          emptyMessage="No campaigns yet"
        />
      )}
      </div>
    </div>
  );
}
