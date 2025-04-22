import { PaginatedResponse } from "@/types/backend/responses";
import fetchBackend from "./template";
import { Category } from "@/types/backend/categories";

export const getCategories = async (): Promise<PaginatedResponse<Category>> => {
  const data = await fetchBackend("/api/categories/", "get");
  return data;
};

export const createCategory = async (
  category: Omit<Category, "id">,
  token: string
) => {
  const data = await fetchBackend("/api/categories/", "post", category, token);
  return data;
};

export const updateCategory = async (
  id: number,
  category: Partial<Omit<Category, "id">>
) => {
  const data = await fetchBackend(`/api/categories/${id}/`, "put", category);
  return data;
};

export const deleteCategory = async (id: number) => {
  const data = await fetchBackend(`/api/categories/${id}/`, "delete");
  return data;
};
