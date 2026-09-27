import { FaInfo } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function InfoButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="How records and points work">
          <FaInfo className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="text-center">
        <h2 className="font-display text-2xl">Information</h2>
        <div className="mt-2 space-y-1 text-small text-muted-foreground">
          <p>Records are updated every 12 hours and</p>
          <p>only top 1000 records are fetched.</p>
        </div>
        <hr className="my-4 border-border-subtle" />
        <h2 className="font-display text-2xl">Points formula</h2>
        <p className="mt-2 text-small text-muted-foreground">
          Best Timegoal Multiplier × Tier Points.
        </p>
      </PopoverContent>
    </Popover>
  );
}
