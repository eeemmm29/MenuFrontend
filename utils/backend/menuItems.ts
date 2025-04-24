import { MenuItem } from "@/types/backend/menuItems";
import fetchBackend from "./template";
import { PaginatedResponse } from "@/types/backend/responses";

export const getMenuItems = async (
  categoryId?: number,
  token?: string,
  shouldGetFavorites: boolean = false
): Promise<PaginatedResponse<MenuItem>> => {
  const baseUrl = `/api/menu-items/?is_favorite=${shouldGetFavorites}`;
  const url = categoryId ? `${baseUrl}&category=${categoryId}` : baseUrl;
  const data = await fetchBackend(url, "get", undefined, token);
  return data;
};

// Add function to get a single menu item by ID
export const getMenuItemById = async (id: number): Promise<MenuItem> => {
  const data = await fetchBackend(`/api/menu-items/${id}/`, "get");
  return data;
};

export const createMenuItem = async (
  menuItemData: FormData, // Expect FormData
  token: string
) => {
  // ContentType will be set by axios for FormData
  const data = await fetchBackend(
    "/api/menu-items/",
    "post",
    menuItemData,
    token
  );
  return data;
};

export const updateMenuItem = async (
  id: number,
  menuItemData: FormData, // Expect FormData
  token: string
) => {
  // Use PATCH for partial updates, especially with optional images
  // ContentType will be set by axios for FormData
  const data = await fetchBackend(
    `/api/menu-items/${id}/`,
    "patch", // Use PATCH
    menuItemData,
    token
  );
  return data;
};

export const deleteMenuItem = async (id: number, token: string) => {
  // Add token parameter
  // Pass token to fetchBackend
  const data = await fetchBackend(
    `/api/menu-items/${id}/`,
    "delete",
    undefined,
    token
  );
  return data;
};
