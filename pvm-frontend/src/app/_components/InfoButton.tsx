"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { FaInfo } from "react-icons/fa";

export default function InfoButton() {
  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <button className="btn-ghost">
          <FaInfo size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-zinc-900 border border-white/20 text-white p-4 max-w-xs">
        <h2 className="text-heading text-sm mb-2">Information</h2>
        <div className="text-white/70 text-sm space-y-1 text-center">
          <p>Records are updated every 8 hours and</p>
          <p>only top 1000 records are fetched.</p>
          <hr className="mt-2 mb-2"></hr>
          <h2 className="text-heading text-sm mb-2 text-center">Points formula</h2>
          <p>Best Timegoal Multiplier × Tier Points.</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}