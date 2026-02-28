"use client";

import { useState, useEffect, useRef } from "react";
import { Spinner } from "@heroui/react";
import axios from "axios";

interface PlayerSearchResult {
  id: string;
  name: string;
  total_points: number;
  rank?: number;
}

interface PlayerSearchProps {
  mappackId: string;
  onPlayerSelect: (playerId: string, playerName: string) => void;
  placeholder?: string;
  className?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function PlayerSearch({
  mappackId,
  onPlayerSelect,
  placeholder = "Search players...",
  className = "",
}: PlayerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setIsLoading(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await axios.get<PlayerSearchResult[]>(
          `${API_BASE}/mappacks/${mappackId}/players/search`,
          { params: { q: searchQuery, limit: 5 } }
        );
        setResults(response.data || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error searching players:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, mappackId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlayerClick = (player: PlayerSearchResult) => {
    setShowDropdown(false);
    setSearchQuery("");
    onPlayerSelect(player.id, player.name);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>

      {/* Input */}
      <div
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-text ${
          isFocused
            ? "bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_4px_24px_rgba(0,0,0,0.5)]"
            : "bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] hover:bg-white/[0.06] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
        }`}
        onClick={() => (wrapperRef.current?.querySelector("input") as HTMLInputElement)?.focus()}
      >
        <svg
          className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${isFocused ? "text-neutral-300" : "text-neutral-600"}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white text-sm placeholder:text-neutral-700 outline-none min-w-0 tracking-wide cursor-text"
        />

        <div className="w-3.5 flex items-center justify-center shrink-0">
          {isLoading ? (
            <Spinner size="sm" color="white" />
          ) : searchQuery ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery("");
                setResults([]);
                setShowDropdown(false);
              }}
              className="text-neutral-600 hover:text-neutral-200 transition-colors text-xs leading-none cursor-pointer"
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (results.length > 0 || (!isLoading && searchQuery)) && (
        <div className="absolute z-50 w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
          {results.length > 0 ? (
            results.map((player, i) => (
              <div
                key={player.id}
                onClick={() => handlePlayerClick(player)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-800 transition-colors ${
                  i !== results.length - 1 ? "border-b border-neutral-800" : ""
                }`}
              >
                <span className="font-ruigslay text-neutral-700 text-lg leading-none w-6 shrink-0 text-right">
                  #{player.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-ruigslay text-white text-base leading-tight truncate">
                    {player.name}
                  </p>
                  <p className="text-neutral-500 text-xs mt-0.5">
                    {player.total_points.toLocaleString()} pts
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-4 text-neutral-600 text-sm text-center">
              No players found for &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}