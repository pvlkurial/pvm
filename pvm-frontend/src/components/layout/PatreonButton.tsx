"use client";
import { SiPatreon } from "react-icons/si";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PatreonButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Support on Patreon">
          <SiPatreon className="size-3.5 text-[#FF424D]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="text-center">
        <h2 className="font-display text-2xl">Support on Patreon</h2>
        <div className="mt-2 space-y-1 text-small text-muted-foreground">
          <p>If you wish, you can help me run the website here.</p>
          <p>Also updates and changes are posted there.</p>
        </div>
        <Button asChild size="sm" className="mt-4">
          <a
            href="https://www.patreon.com/cw/PVMWebsite/membership"
            target="_blank"
            rel="noopener noreferrer"
          >
            Become a Patron
          </a>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
