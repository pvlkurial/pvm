import { authService } from "./authService";

import { API_BASE } from "@/constants/miscellaneous";

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const savedAuth = authService.loadAuth();

  if (!savedAuth) {
    throw new Error("Not authenticated");
  }

  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${savedAuth.token}`,
      "Content-Type": "application/json",
    },
  });
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
