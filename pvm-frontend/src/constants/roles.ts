import { Role } from "@/types/auth";

export const ROLE_LABELS: Record<Role, string> = {
  user: "User",
  admin: "Admin",
  superadmin: "Superadmin",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  user: "User",
  admin: "Administrator",
  superadmin: "Super Administrator",
};

/** Tailwind classes for the navbar role badge. Users get no badge. */
export const ROLE_BADGE_CLASSES: Record<Role, string> = {
  user: "",
  admin: "bg-yellow-500/20 text-yellow-400",
  superadmin: "bg-fuchsia-500/20 text-fuchsia-300",
};
