export const MODAL_INPUT_CLASSNAMES = {
  input: "text-white",
  inputWrapper:
    "bg-neutral-800 border-gray-700 data-[hover=true]:border-gray-600 group-data-[focus=true]:bg-neutral-900 group-data-[focus=true]:border-white",
  label: "text-white/70",
};

/**
 * Select has no `input`/`inputWrapper` slot — its equivalent is `trigger`, so
 * spreading MODAL_INPUT_CLASSNAMES into one silently does nothing. These mirror
 * the input treatment onto the slots Select actually uses.
 */
export const MODAL_SELECT_CLASSNAMES = {
  label: "text-white/70",
  value: "text-white",
  selectorIcon: "text-white/60",
  trigger:
    "bg-neutral-800 border-gray-700 data-[hover=true]:border-gray-600 data-[open=true]:bg-neutral-900 data-[open=true]:border-white data-[focus=true]:border-white",
  listboxWrapper: "bg-neutral-800",
  popoverContent: "bg-neutral-800",
};

/** Autocomplete wraps an Input, so the field itself goes through inputProps. */
export const MODAL_AUTOCOMPLETE_CLASSNAMES = {
  base: "text-white",
  selectorButton: "text-white",
  listboxWrapper: "bg-neutral-800",
  popoverContent: "bg-neutral-800",
};

export const MODAL_SWITCH_CLASSNAMES = {
  wrapper: "group-data-[selected=true]:bg-white bg-neutral-600",
};

export const MODAL_CLASSNAMES = {
  base: "bg-neutral-800",
  header: "bg-neutral-800 text-white",
  body: "bg-neutral-800 text-white",
  footer: "bg-neutral-800",
  closeButton: "text-white hover:bg-neutral-800",
};

export const TAB_CLASSNAMES = {
  tabList: "bg-neutral-700",
  cursor: "bg-neutral-600",
  tab: "text-white",
  tabContent: "group-data-[selected=true]:text-white",
};
