export const FILTER_POPOVER_CLASSNAMES = {
  base: " border border-zinc-800",
  content: "p-0",
};

export const getFilterButtonClassName = (isActive: boolean) => `
  btn-ghost flex items-center justify-center
  ${
    isActive
      ? "bg-blue-300/20 text-blue-400 border border-blue-300/50 btn-ghost"
      : "btn-ghost"
  }
`;