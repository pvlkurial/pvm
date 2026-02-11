export const FILTER_MODAL_CLASSNAMES = {
  base: "bg-zinc-900",
  header: "bg-zinc-900 border-b border-zinc-800",
  body: "bg-zinc-900",
  footer: "bg-zinc-900 border-t border-zinc-800",
};

export const getFilterButtonClassName = (isActive: boolean) => `
  w-9 h-9 p-0 flex items-center justify-center
  ${
    isActive
      ? "bg-orange-500/20 text-orange-400 border border-orange-500/50"
      : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
  }
`;