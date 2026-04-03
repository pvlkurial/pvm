"use client";
import { useState, useEffect } from "react";
import { BiSortDown, BiSortUp } from "react-icons/bi";

type SortOrder = "asc" | "desc";

const STORAGE_KEY = "tier-sort-order";

interface TierSortButtonProps {
  onSortOrderChange: (order: SortOrder) => void;
}

export function TierSortButton({ onSortOrderChange }: TierSortButtonProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    if (typeof window === "undefined") return "asc";
    return (localStorage.getItem(STORAGE_KEY) as SortOrder) ?? "asc";
  });
  useEffect(() => {
    onSortOrderChange(sortOrder);
  }, []);

  const handleSort = () => {
    const newOrder: SortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    localStorage.setItem(STORAGE_KEY, newOrder);
    onSortOrderChange(newOrder);
  };

  return (
    <button onClick={handleSort} className="btn-ghost">
      {sortOrder === "asc" ? (
        <BiSortUp className="text-white/80 w-5 h-5" />
      ) : (
        <BiSortDown className="text-white/80 w-5 h-5" />
      )}
    </button>
  );
}
