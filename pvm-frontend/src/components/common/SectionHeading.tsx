import { cn } from "@/lib/utils";

const TITLE_SIZES = {
  sm: "text-title",
  md: "text-display-m",
  lg: "text-display-m sm:text-display-l",
} as const;

interface SectionHeadingProps {
  children: React.ReactNode;
  /** Mono label above the title, e.g. "01 — PVM". */
  eyebrow?: string;
  /** Shown in italic serif after the title. */
  count?: number;
  size?: keyof typeof TITLE_SIZES;
  /** Extra classes for the wrapper, e.g. top spacing between sections. */
  className?: string;
}

/** A serif title under a strong rule. Every section on the site opens with one. */
export function SectionHeading({
  children,
  eyebrow,
  count,
  size = "sm",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "border-t-2 border-border-strong",
        size === "sm" ? "pt-3" : "pt-4",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <div className="flex items-baseline gap-3">
        <h2 className={cn("font-display", TITLE_SIZES[size])}>{children}</h2>
        {count !== undefined && (
          <span className="font-display text-display-count text-faint italic">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}
