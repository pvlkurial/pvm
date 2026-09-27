"use client";
import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

interface IndicatorRect {
  left: number;
  width: number;
}

/**
 * Follows the active trigger inside the list. Radix marks it with
 * data-state="active", so watching that attribute covers both controlled and
 * uncontrolled tabs.
 */
function useActiveIndicator(listRef: React.RefObject<HTMLDivElement | null>) {
  const [rect, setRect] = React.useState<IndicatorRect | null>(null);

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const active = list.querySelector<HTMLElement>('[data-state="active"]');
      setRect(active ? { left: active.offsetLeft, width: active.offsetWidth } : null);
    };

    measure();
    const mutations = new MutationObserver(measure);
    mutations.observe(list, { attributes: true, subtree: true, attributeFilter: ["data-state"] });
    const resizes = new ResizeObserver(measure);
    resizes.observe(list);

    return () => {
      mutations.disconnect();
      resizes.disconnect();
    };
  }, [listRef]);

  return rect;
}

/** A pill track; a single inverted pill slides to the selected tab. */
function TabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const indicator = useActiveIndicator(listRef);

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      className={cn(
        "relative inline-flex w-fit items-center gap-1 rounded-full bg-surface-2 p-1",
        className,
      )}
      {...props}
    >
      {indicator && (
        <span
          aria-hidden
          className="absolute inset-y-1 rounded-full bg-primary transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
      {children}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 h-8 cursor-pointer whitespace-nowrap rounded-full px-4 text-ui font-medium text-muted-foreground transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary-foreground data-[state=inactive]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
