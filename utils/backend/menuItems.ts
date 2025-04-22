import { MenuItem } from "@/types/backend/menuItems";
import fetchBackend from "./template";
import { PaginatedResponse } from "@/types/backend/responses";

export const getMenuItems = async (): Promise<PaginatedResponse<MenuItem>> => {
  const data = await fetchBackend("/api/menu-items/", "get");
  console.log("Menu items data:", data);
  console.log(typeof data.results[0].price);
  return data;
};

// Add function to get a single menu item by ID
export const getMenuItemById = async (id: number): Promise<MenuItem> => {
  const data = await fetchBackend(`/api/menu-items/${id}/`, "get");
  return data;
};

export const createMenuItem = async (
  menuItem: Omit<MenuItem, "id">,
  token: string
) => {
  const data = await fetchBackend("/api/menu-items/", "post", menuItem, token);
  return data;
};

export const updateMenuItem = async (
  id: number,
  menuItem: Partial<Omit<MenuItem, "id">>,
  token: string // Add token parameter
) => {
  // Pass token to fetchBackend
  const data = await fetchBackend(
    `/api/menu-items/${id}/`,
    "put",
    menuItem,
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
