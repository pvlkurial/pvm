/**
 * Shared admin button styles. Every admin control uses the same surface-and-
 * border treatment so they read as one family; only the weight changes.
 *
 * Pass these as `className` on a HeroUI <Button> and leave `color`/`variant`
 * unset — those props apply their own background that would fight with these.
 */

/** Default admin action. The baseline the others are derived from. */
export const ADMIN_BUTTON =
  "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white";

/** The confirming action in a form or modal footer: one step brighter. */
export const ADMIN_BUTTON_PRIMARY =
  "bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 text-white font-semibold";

/** Destructive action: same shape and weight, tinted red. */
export const ADMIN_BUTTON_DANGER =
  "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-300 hover:text-red-200";
