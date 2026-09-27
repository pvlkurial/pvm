import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface PaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  className?: string;
}

type PageSlot = number | "ellipsis-start" | "ellipsis-end";

/** First, last, and the current page with one neighbour either side. */
function pageSlots(page: number, total: number): PageSlot[] {
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const visible = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const slots: PageSlot[] = [];
  visible.forEach((p, i) => {
    const previous = visible[i - 1];
    if (previous !== undefined && p - previous > 1) {
      slots.push(p < page ? "ellipsis-start" : "ellipsis-end");
    }
    slots.push(p);
  });
  return slots;
}

function Pagination({ page, total, onChange, className }: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1", className)}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <LuChevronLeft className="size-4" />
      </Button>

      {pageSlots(page, total).map((slot) =>
        typeof slot === "number" ? (
          <Button
            key={slot}
            variant="ghost"
            size="icon-sm"
            aria-current={slot === page ? "page" : undefined}
            onClick={() => onChange(slot)}
            className={cn(
              "tabular-nums text-caption",
              slot === page && "bg-surface-3 text-foreground",
            )}
          >
            {slot}
          </Button>
        ) : (
          <span
            key={slot}
            className="w-8 text-center tabular-nums text-caption text-faint"
          >
            …
          </span>
        ),
      )}

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Next page"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
      >
        <LuChevronRight className="size-4" />
      </Button>
    </nav>
  );
}

export { Pagination };
