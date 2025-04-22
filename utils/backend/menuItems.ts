import { MenuItem } from "@/types/backend/menuItems";
import fetchBackend from "./template";
import { PaginatedResponse } from "@/types/backend/responses";

export const getMenuItems = async (): Promise<PaginatedResponse<MenuItem>> => {
  const data = await fetchBackend("/api/menu-items/", "get");
  console.log("Menu items data:", data);
  console.log(typeof data.results[0].price);
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
  menuItem: Partial<Omit<MenuItem, "id">>
) => {
  const data = await fetchBackend(`/api/menu-items/${id}/`, "put", menuItem);
  return data;
};

export const deleteMenuItem = async (id: number) => {
  const data = await fetchBackend(`/api/menu-items/${id}/`, "delete");
  return data;
};
