import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full min-w-0 border border-border bg-surface-2 text-ui text-foreground placeholder:text-faint outline-none transition-colors hover:border-muted-foreground/40 focus-visible:border-foreground disabled:cursor-not-allowed disabled:opacity-50";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldBase, "h-10 rounded-full px-4", className)}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldBase, "min-h-20 rounded-2xl px-4 py-3 leading-normal", className)}
      {...props}
    />
  );
}

export { Input, Textarea, fieldBase };
