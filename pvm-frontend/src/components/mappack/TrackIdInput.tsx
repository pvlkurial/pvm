"use client";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { TmxTrack } from "@/types/tmx.types";
import { tmxService } from "@/services/tmx.service";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeading } from "@/components/common/SectionHeading";

interface TrackIdInputProps {
  trackUuid: string;
  tmxId: string;
  onUuidChange: (value: string) => void;
  onTmxIdChange: (value: string) => void;
}

function TmxSearch({
  onSelect,
}: {
  onSelect: (track: TmxTrack) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmxTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const search = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      setResults(await tmxService.searchTracks(query));
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const select = (track: TmxTrack) => {
    setSelectedId(track.TrackID);
    onSelect(track);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-2">
        <Field label="Search Track Name" className="flex-1">
          <Input
            placeholder="Enter track name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
        </Field>
        <Button
          variant="outline"
          size="icon"
          aria-label="Search TMX"
          onClick={search}
          loading={isSearching}
          disabled={!query.trim()}
        >
          {!isSearching && <IoSearch className="size-5" />}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
          {results.map((track) => (
            <button
              key={track.TrackID}
              type="button"
              onClick={() => select(track)}
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                selectedId === track.TrackID
                  ? "border-foreground bg-surface-3"
                  : "border-border bg-surface-2 hover:bg-surface-3",
              )}
            >
              {track.ThumbnailURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.ThumbnailURL}
                  alt={track.Name}
                  loading="lazy"
                  className="h-16 w-24 rounded-md object-cover"
                />
              ) : (
                <span className="flex h-16 w-24 items-center justify-center rounded-md bg-surface-3 text-small text-faint">
                  No image
                </span>
              )}
              <span className="flex-1">
                <span className="block font-medium">{track.Name}</span>
                <span className="mt-1 block text-small text-muted-foreground">
                  by {track.AuthorName}
                </span>
                <span className="mt-1 block tabular-nums text-caption text-faint">
                  TMX ID: {track.TrackID}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TrackIdInput({
  trackUuid,
  tmxId,
  onUuidChange,
  onTmxIdChange,
}: TrackIdInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeading>Track Info</SectionHeading>

      <Tabs defaultValue="search">
        <TabsList aria-label="Track ID Input Method">
          <TabsTrigger value="search">TMX Search</TabsTrigger>
          <TabsTrigger value="uuid">Manual Input</TabsTrigger>
        </TabsList>

        {/* forceMount keeps the search results when switching tabs. */}
        <TabsContent value="search" forceMount className="pt-4 data-[state=inactive]:hidden">
          <TmxSearch
            onSelect={(track) => {
              onUuidChange(track.MapUUID);
              onTmxIdChange(track.TrackID.toString());
            }}
          />
        </TabsContent>

        <TabsContent value="uuid" className="flex flex-col gap-4 pt-4">
          <Field label="Track UUID">
            <Input
              placeholder="a282e3f9-5585-4edf-9db1-c370ff1190d9"
              value={trackUuid}
              onChange={(e) => onUuidChange(e.target.value)}
            />
          </Field>
          <Field label="TMX ID">
            <Input
              placeholder="123456"
              value={tmxId}
              onChange={(e) => onTmxIdChange(e.target.value)}
            />
          </Field>
        </TabsContent>
      </Tabs>
    </div>
  );
}
