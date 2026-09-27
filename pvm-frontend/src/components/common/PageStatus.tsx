import { cn } from "@/lib/utils";

interface PageStatusProps {
  children: React.ReactNode;
  /** Pulses the message, for loading states. */
  pending?: boolean;
  className?: string;
}

/** A centred full-height message for loading, empty and not-found states. */
export function PageStatus({ children, pending = false, className }: PageStatusProps) {
  return (
    <div className={cn("flex min-h-[60vh] items-center justify-center", className)}>
      <p
        className={cn(
          "font-display text-display-count text-muted-foreground",
          pending && "animate-pulse",
        )}
      >
        {children}
      </p>
    </div>
  );
}
