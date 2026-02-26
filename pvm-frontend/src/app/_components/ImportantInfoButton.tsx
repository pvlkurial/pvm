"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ImportantInfoButton() {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <button className="p-2 btn-ghost border border-yellow-500/40 text-yellow-500/70 hover:text-yellow-400 hover:border-yellow-400 transition-colors">
          <FaExclamationTriangle size={14} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-zinc-900 border border-yellow-500/30 text-white p-4 max-w-xs text-center">
        <h2 className="text-heading text-sm text-yellow-400 mb-2">Important</h2>
        <div className="text-white/70 text-sm space-y-1">
          <p>Soon we'll be moving to</p>
          <a href="http://pvms.club"
          className="text-yellow-400 hover:text-yellow-300 underline transition-colors">
          pvms.club
          </a>
          <p>As of now, that site still only redirects to here.</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}