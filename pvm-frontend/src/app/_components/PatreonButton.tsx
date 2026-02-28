"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { SiPatreon } from "react-icons/si";

export default function PatreonButton() {
  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <button className="btn-ghost text-[#FF424D] hover:text-[#FF424D]/80 transition-colors">
          <SiPatreon size={14} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-zinc-900 border border-white/20 text-white p-4 max-w-xs">
        <h2 className="text-heading text-sm mb-2">Support on Patreon</h2>
        <div className="text-white/70 text-sm space-y-1 text-center">
          <p>If you wish, you can help me run the website here.</p>
          <p>Also updates and changes are posted there.</p>
          <hr className="mt-2 mb-2" />
          <a
            href="https://www.patreon.com/cw/PVMWebsite/membership"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 px-3 py-1.5 rounded-md bg-[#FF424D] text-white text-xs font-semibold hover:bg-[#FF424D]/80 transition-colors"
          >
            Become a Patron
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
}