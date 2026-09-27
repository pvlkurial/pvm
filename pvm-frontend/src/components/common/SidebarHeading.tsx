/**
 * The title at the top of a mappack page side column. On wide screens every
 * such title shares one height (see useSidebarTitleHeight), so the dividers
 * under the left and right columns line up even when one title wraps.
 */
export function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-5">
      <div className="flex items-center justify-center text-center lg:min-h-(--sidebar-title-height)">
        <div data-sidebar-title className="font-display text-5xl leading-none text-balance">
          {children}
        </div>
      </div>
    </div>
  );
}
