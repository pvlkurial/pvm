import { authService } from "./authService";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
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

// Example usage:
export async function fetchUserAchievements(
  mappackId: string,
  playerId: string
) {
  const response = await authenticatedFetch(
    `/mappacks/${mappackId}/players/${playerId}/achievements`
  );
  return response.json();
}