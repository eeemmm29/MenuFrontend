import { Favorite } from "@/types/backend/favorites";
import { PaginatedResponse } from "@/types/backend/responses";
import fetchBackend from "./template";

// Get all favorite items for the logged-in user
export const getFavorites = async (
  token: string
): Promise<PaginatedResponse<Favorite>> => {
  const data = await fetchBackend("/api/favorites/", "get", undefined, token);
  return data;
};

// Add a menu item to favorites
export const addFavorite = async (
  menuItemId: number,
  token: string
): Promise<Favorite> => {
  const payload = { menuItemId };
  const data = await fetchBackend("/api/favorites/", "post", payload, token);
  return data;
};

// Remove a menu item from favorites using the favorite ID
export const removeFavorite = async (
  favoriteId: number,
  token: string
): Promise<void> => {
  await fetchBackend(
    `/api/favorites/${favoriteId}/`,
    "delete",
    undefined,
    token
  );
};
