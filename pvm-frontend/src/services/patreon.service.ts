import { authenticatedFetch } from "./api";
import { authService } from "./authService";

async function errorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
}

/** Re-reads the user so the new Patreon link and supporter status show everywhere. */
async function syncCurrentUser(): Promise<void> {
  const savedAuth = authService.loadAuth();
  if (!savedAuth) return;
  const user = await authService.getCurrentUser(savedAuth.token);
  authService.updateCachedUser(user);
  window.dispatchEvent(new Event("auth-changed"));
}

export const patreonService = {
  /** The Patreon consent link, carrying a state bound to the signed-in user. */
  async getConnectUrl(): Promise<string> {
    const response = await authenticatedFetch("/auth/patreon/connect");
    if (!response.ok) {
      throw new Error(await errorMessage(response, "Patreon connection is not available"));
    }
    const data = await response.json();
    return data.auth_url;
  },

  /** Redeems the code Patreon redirected back with. Resolves to the supporter status. */
  async connect(code: string, state: string): Promise<boolean> {
    const response = await authenticatedFetch("/auth/patreon/callback", {
      method: "POST",
      body: JSON.stringify({ code, state }),
    });
    if (!response.ok) {
      throw new Error(await errorMessage(response, "Failed to connect Patreon"));
    }
    const data = await response.json();
    await syncCurrentUser();
    return !!data.patreon_supporter;
  },

  async disconnect(): Promise<void> {
    const response = await authenticatedFetch("/auth/patreon", { method: "DELETE" });
    if (!response.ok) {
      throw new Error(await errorMessage(response, "Failed to disconnect Patreon"));
    }
    await syncCurrentUser();
  },
};
