import { authenticatedFetch } from "./api";
import { AdminUser, MyPermissions, PlayerWithRole, Role } from "@/types/auth";
import { Mappack } from "@/types/mappack.types";

async function unwrap<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.json();
      message = body.error ?? message;
    } catch {
      // Non-JSON error body; fall back to the status text.
    }
    throw new Error(message);
  }
  return response.json();
}

export const adminService = {
  getMyPermissions: async (): Promise<MyPermissions> =>
    unwrap(await authenticatedFetch("/auth/me/permissions")),

  listUsers: async (): Promise<AdminUser[]> =>
    unwrap(await authenticatedFetch("/admin/users")),

  /** Searches every stored player, whether or not they have ever signed in. */
  searchPlayers: async (
    query: string,
    limit = 25,
  ): Promise<PlayerWithRole[]> =>
    unwrap(
      await authenticatedFetch(
        `/admin/players?q=${encodeURIComponent(query)}&limit=${limit}`,
      ),
    ),

  /** Every mappack, including inactive and non-pvm ones. */
  listAllMappacks: async (): Promise<Mappack[]> =>
    unwrap(await authenticatedFetch("/admin/mappacks")),

  setUserRole: async (userId: string, role: Role): Promise<void> => {
    await unwrap(
      await authenticatedFetch(`/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      }),
    );
  },

  /** Replaces the admin's grants with exactly mappackIds. */
  setUserPermissions: async (
    userId: string,
    mappackIds: string[],
  ): Promise<void> => {
    await unwrap(
      await authenticatedFetch(`/admin/users/${userId}/permissions`, {
        method: "PUT",
        body: JSON.stringify({ mappack_ids: mappackIds }),
      }),
    );
  },
};
