export const FILTER_POPOVER_CLASSNAMES = {
  base: " border border-zinc-800",
  content: "p-0",
};

export const getFilterButtonClassName = (isActive: boolean) => `
  w-9 h-9 p-0 min-w-0 flex items-center justify-center
  ${
    isActive
      ? "bg-orange-500/20 text-orange-400 border border-orange-500/50 btn-ghost"
      : "btn-ghost"
  }
`;