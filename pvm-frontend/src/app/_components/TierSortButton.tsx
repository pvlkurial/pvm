"use client";
import { useState } from "react";
import { Button } from "@heroui/react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { BiSortDown, BiSortUp } from "react-icons/bi";

type SortOrder = "asc" | "desc";

interface TierSortButtonProps {
  onSortOrderChange: (order: SortOrder) => void;
}

export function TierSortButton({ onSortOrderChange }: TierSortButtonProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = () => {
    const newOrder: SortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    onSortOrderChange(newOrder);
  };

  return (
    <button

      onClick={handleSort}
      className="btn-ghost">
      {
        sortOrder === "asc" ? (
          <BiSortUp className="text-white/80 w-5 h-5" />
        ) : (
          <BiSortDown className="text-white/80 w-5 h-5" />
        )
      }
    </button>
  );
}