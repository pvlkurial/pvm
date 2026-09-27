import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-border bg-surface-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block size-4 translate-x-0.5 rounded-full bg-muted-foreground transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-primary-foreground"
      />
    </SwitchPrimitive.Root>
  );
}

interface SwitchFieldProps
  extends Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, "children"> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

/** A switch with its label (and optional hint) to the right. */
function SwitchField({ label, description, className, ...props }: SwitchFieldProps) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-3", className)}>
      <Switch {...props} />
      <span className="text-ui text-foreground">
        {label}
        {description && (
          <span className="mt-1 block text-small text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

export { Switch, SwitchField };
