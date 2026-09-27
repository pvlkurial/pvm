export type Role = "user" | "admin" | "superadmin";

// Mirrors the backend hierarchy in models/user.go.
export const ROLE_RANK: Record<Role, number> = {
  user: 1,
  admin: 2,
  superadmin: 3,
};

export function hasAtLeastRole(
  role: string | undefined,
  minRole: Role,
): boolean {
  const have = ROLE_RANK[role as Role];
  return have !== undefined && have >= ROLE_RANK[minRole];
}

export interface User {
  id: string;
  name: string;
  role: Role;
  /** Patreon supporter on the tier that may refresh their own records. */
  is_supporter?: boolean;
}

/** Superadmins and supporters may pull their own record for a track on demand. */
export function canRefreshRecords(user: User | null | undefined): boolean {
  return !!user && (user.role === "superadmin" || !!user.is_supporter);
}

// What the signed-in user is allowed to manage, from GET /auth/me/permissions.
export interface MyPermissions {
  role: Role;
  can_create_mappack: boolean;
  manages_all: boolean;
  mappack_ids: string[];
}

/** A known player and the site role they hold, from GET /admin/players. */
export interface PlayerWithRole {
  id: string;
  name: string;
  role: Role;
  /** False for players who have never signed in; a role can still be assigned. */
  has_login: boolean;
}

export interface AdminUser extends User {
  created_at: string;
  updated_at: string;
  mappack_ids: string[];
}

export interface AuthResponse {
  token: string;
  user_id: string;
  name: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}