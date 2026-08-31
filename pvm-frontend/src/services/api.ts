import { authService } from "./authService";

import { API_BASE } from "@/constants/miscellaneous";

/**
 * Clears the session and lets the app know. Used when the server rejects our
 * token — otherwise the UI keeps looking signed in while every authenticated
 * request quietly fails, and only a manual logout recovers.
 */
function handleRejectedToken() {
  authService.logout();
  window.dispatchEvent(new Event("auth-changed"));
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const savedAuth = authService.loadAuth();

  if (!savedAuth) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${savedAuth.token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    handleRejectedToken();
  }

  return response;
}

export async function fetchUserAchievements(
  mappackId: string,
  playerId: string,
) {
  const response = await authenticatedFetch(
    `/mappacks/${mappackId}/players/${playerId}/achievements`,
  );
  return response.json();
}
