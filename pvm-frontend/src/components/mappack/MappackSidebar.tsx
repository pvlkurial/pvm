"use client";
import { useState } from "react";
import { FaDiscord, FaGlobe, FaTable } from "react-icons/fa6";
import { Mappack } from "@/types/mappack.types";
import { TracksByTier } from "@/utils/mappack.utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RequireMappackPermission } from "@/components/common/RequireMappackPermission";
import { ExternalIconLink } from "@/components/common/ExternalIconLink";
import { EditMappackDialog } from "@/components/mappack-edit/EditMappackDialog";
import { AddTrackDialog } from "./AddTrackDialog";

const FALLBACK_TIER_COLOR = "#6b7280";

interface MappackSidebarProps {
  mappack: Mappack;
  sortedTiers: string[];
  tracksByTier: TracksByTier;
  activeTier: string;
  /** Tiers only make sense next to the maps tab. */
  showTiers: boolean;
  onTierClick: (tier: string) => void;
  onEditSave: () => void;
}

function MappackTitle({ mappack }: { mappack: Mappack }) {
  const links = [
    { href: mappack.sheeturl, label: "Spreadsheet", icon: <FaTable /> },
    { href: mappack.discordurl, label: "Discord", icon: <FaDiscord /> },
    { href: mappack.websiteurl, label: "Website", icon: <FaGlobe /> },
  ].filter((link) => link.href);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="cursor-pointer pt-3 text-center font-display text-[40px] leading-none text-balance transition-opacity hover:opacity-80"
        >
          {mappack.name}
        </button>
      </PopoverTrigger>
      <PopoverContent side="right" className="w-64">
        <p className="text-center text-small break-words text-muted-foreground">
          {mappack.description}
        </p>
        {links.length > 0 && (
          <div className="mt-3 flex justify-center gap-2">
            {links.map((link) => (
              <ExternalIconLink key={link.label} href={link.href} label={link.label}>
                {link.icon}
              </ExternalIconLink>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-5">
      <p className="eyebrow mb-3 text-center">{title}</p>
      {children}
    </section>
  );
}

export function MappackSidebar({
  mappack,
  sortedTiers,
  tracksByTier,
  activeTier,
  showTiers,
  onTierClick,
  onEditSave,
}: MappackSidebarProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const sortedTimeGoals = [...mappack.timeGoals].sort(
    (a, b) => (a.multiplier ?? 0) - (b.multiplier ?? 0),
  );

  return (
    <aside className="scrollbar-hide lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto">
      <div className="flex flex-col gap-5 p-4">
        <MappackTitle mappack={mappack} />

        <SidebarSection title="Timegoals">
          <ul className="flex flex-col gap-1.5">
            {sortedTimeGoals.map((timeGoal) => (
              <li
                key={timeGoal.name}
                className="flex items-center justify-center gap-1.5 text-small"
              >
                <span className="font-medium text-foreground">{timeGoal.name}</span>
                <span className="font-mono text-mono-s text-faint">
                  {timeGoal.multiplier}x
                </span>
              </li>
            ))}
          </ul>
        </SidebarSection>

        {showTiers && (
          <SidebarSection title="Tiers">
            <div className="flex flex-col gap-1">
              {sortedTiers.map((tierName) => {
                const { tier, tracks } = tracksByTier[tierName];
                const isActive = activeTier === tierName;

                return (
                  <button
                    key={tierName}
                    type="button"
                    onClick={() => onTierClick(tierName)}
                    style={
                      {
                        "--tier-color": tier?.color || FALLBACK_TIER_COLOR,
                      } as React.CSSProperties
                    }
                    className={cn(
                      "w-full cursor-pointer rounded-full px-3 py-1.5 text-small uppercase transition-colors duration-150",
                      isActive
                        ? "bg-[color-mix(in_srgb,var(--tier-color)_56%,transparent)] font-semibold text-foreground"
                        : "text-muted-foreground hover:bg-[color-mix(in_srgb,var(--tier-color)_10%,transparent)]",
                    )}
                  >
                    {tierName} ({tracks.length})
                  </button>
                );
              })}
            </div>

            <RequireMappackPermission mappackId={mappack.id}>
              <div className="mt-3 flex justify-center">
                <AddTrackDialog timegoals={mappack.timeGoals} mappackId={mappack.id} />
              </div>
            </RequireMappackPermission>
          </SidebarSection>
        )}

        <RequireMappackPermission mappackId={mappack.id}>
          <div className="flex justify-center border-t border-border pt-5">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
              Edit Mappack
            </Button>
            <EditMappackDialog
              mappack={mappack}
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              onSave={onEditSave}
            />
          </div>
        </RequireMappackPermission>
      </div>
    </aside>
  );
}
