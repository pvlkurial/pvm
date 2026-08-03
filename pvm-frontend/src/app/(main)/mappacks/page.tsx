"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mappack } from "@/types/mappack.types";
import { usePermissions } from "@/hooks/usePermissions";
import { MappackGrid } from "@/app/_components/mappacks/MappackGrid";
import { API_BASE } from "@/constants/miscellaneous";
import "./mappacks.css";

export default function MapppacksPage() {
  const [mappacks, setMappacks] = useState<Mappack[]>([]);
  const [campaigns, setCampaigns] = useState<Mappack[]>([]);
  const [loading, setLoading] = useState(true);
  // Only superadmins may create mappacks; admins are scoped to their grants.
  const { canCreateMappack } = usePermissions();

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

  return (
    <div className="mp-page">
      <MappackGrid
        label="PVM"
        mappacks={mappacks}
        showAddCard={canCreateMappack}
        isLoading={loading}
        emptyMessage="no mappacks yet"
      />

      {campaigns.length > 0 && (
        <MappackGrid
          label="Campaign"
          mappacks={campaigns}
          isLoading={loading}
          emptyMessage="no campaigns yet"
        />
      )}
    </div>
  );
}
