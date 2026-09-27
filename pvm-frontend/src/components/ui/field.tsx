import * as React from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * A label above a single control. The wrapping <label> associates the text with
 * the control inside it, so call sites don't need to thread ids through.
 */
function Field({ label, description, className, children }: FieldProps) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <span className="text-small text-muted-foreground">{label}</span>
      {children}
      {description && (
        <span className="text-caption tabular-nums text-faint">{description}</span>
      )}
    </label>
  );
}

export { Field };
