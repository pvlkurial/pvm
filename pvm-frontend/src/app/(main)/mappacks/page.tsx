"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mappack } from "@/types/mappack.types";
import { usePermissions } from "@/hooks/usePermissions";
import { MappackCarouselSection } from "@/app/_components/mappacks/MappackCarouselSection";
import { API_BASE } from "@/constants/miscellaneous";
import "./mappacks.css";

export default function MapppacksPage() {
  const [mappacks, setMappacks] = useState<Mappack[]>([]);
  const [campaigns, setCampaigns] = useState<Mappack[]>([]);
  const [loading, setLoading] = useState(true);
  // Only superadmins may create mappacks; admins are scoped to their grants.
  const { canCreateMappack } = usePermissions();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    // Campaigns come from their own endpoint so the two listings never mix.
    // Settled rather than all: one endpoint failing must not blank the other.
    Promise.allSettled([
      axios.get(`${API_BASE}/mappacks`),
      axios.get(`${API_BASE}/campaigns`),
    ])
      .then(([mappackResult, campaignResult]) => {
        if (mappackResult.status === "fulfilled") {
          setMappacks(mappackResult.value.data ?? []);
        } else {
          console.log("Failed to load mappacks:", mappackResult.reason?.message);
        }

        if (campaignResult.status === "fulfilled") {
          setCampaigns(campaignResult.value.data ?? []);
        } else {
          console.log(
            "Failed to load campaigns:",
            campaignResult.reason?.message,
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Campaigns only claim half the screen once there is something to show, so
  // the page keeps its full-bleed look when none exist.
  const showCampaigns = loading || campaigns.length > 0;

  return (
    <div className="mp-page">
      <MappackCarouselSection
        label="Player vs Map"
        mappacks={mappacks}
        showAddCard={canCreateMappack}
        isOnlySection={!showCampaigns}
        isLoading={loading}
        emptyMessage="no mappacks yet"
      />

      {showCampaigns && (
        <MappackCarouselSection
          label="Campaigns"
          mappacks={campaigns}
          isOnlySection={false}
          isLoading={loading}
          emptyMessage="no campaigns yet"
        />
      )}
    </div>
  );
}
