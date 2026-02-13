"use client";
import { useState } from "react";
import { Button } from "@heroui/react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

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
    <Button
      size="sm"
      variant="flat"
      onPress={handleSort}
      className="bg-zinc-800/50 hover:bg-zinc-700/50 text-white"
      startContent={
        sortOrder === "asc" ? (
          <FaSortAmountUp className="text-orange-500" />
        ) : (
          <FaSortAmountDown className="text-orange-500" />
        )
      }
    >
      {sortOrder === "asc" ? "Easy → Hard" : "Hard → Easy"}
    </Button>
  );
}