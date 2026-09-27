import { Role } from "@/types/auth";

export const ROLES: Role[] = ["user", "admin", "superadmin"];

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
