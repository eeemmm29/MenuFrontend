import { PaginatedResponse } from "@/types/backend/responses";
import fetchBackend from "./template";
import { Category } from "@/types/backend/categories";

export const getCategories = async (): Promise<PaginatedResponse<Category>> => {
  const data = await fetchBackend("/api/categories/", "get");
  return data;
};

// Add function to get a single category by ID
export const getCategoryById = async (id: number): Promise<Category> => {
  const data = await fetchBackend(`/api/categories/${id}/`, "get");
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
  category: Partial<Omit<Category, "id">>,
  token: string // Add token parameter
) => {
  // Pass token to fetchBackend
  const data = await fetchBackend(
    `/api/categories/${id}/`,
    "put",
    category,
    token
  );
  return data;
};

export const deleteCategory = async (id: number, token: string) => {
  // Add token parameter
  // Pass token to fetchBackend
  const data = await fetchBackend(
    `/api/categories/${id}/`,
    "delete",
    undefined,
    token
  );
  return data;
};
