"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SubmitHandler } from "react-hook-form";
import { getMenuItemById, updateMenuItem } from "@/utils/backend/menuItems";
import { MenuItem } from "@/types/backend/menuItems";
import { routes } from "@/config/routes";
import MenuItemForm, { MenuItemFormData } from "@/components/MenuItemForm";
import Protected from "@/components/Protected";

export default function EditMenuItemPage() {
  const { id } = useParams();
  const menuItemId = Number(id);
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); // Submission loading
  const [isFetching, setIsFetching] = useState(true); // Initial data fetching
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<
    Partial<MenuItemFormData> | undefined
  >(undefined);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(
    undefined
  );

  // Fetch menu item data
  useEffect(() => {
    if (menuItemId && session?.access) {
      setIsFetching(true);
      getMenuItemById(menuItemId)
        .then((data) => {
          setInitialData({
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
          });
          setCurrentImageUrl(data.image);
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to fetch menu item for editing:", err);
          setError(err.message || "Failed to load menu item data.");
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else if (!session?.access) {
      setError("You must be logged in to edit a menu item.");
      setIsFetching(false);
    } else {
      setError("Invalid menu item ID.");
      setIsFetching(false);
    }
  }, [menuItemId, session]);

  const onSubmit: SubmitHandler<MenuItemFormData> = async (data) => {
    const token = session?.access;
    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }
    if (!menuItemId) {
      setError("Menu Item ID is missing.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const priceAsNumber =
      typeof data.price === "string" ? parseFloat(data.price) : data.price;
    const payload: Partial<Omit<MenuItem, "id" | "image">> = {
      name: data.name,
      description: data.description,
      price: priceAsNumber,
      category: Number(data.category),
    };

    // Image update not handled here

    try {
      await updateMenuItem(menuItemId, payload, token);
      router.push(routes.menuItemDetail(menuItemId));
    } catch (err: any) {
      console.error("Failed to update menu item:", err);
      setError(err.message || "An unexpected error occurred while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div>Loading data...</div>;
  if (error && !isFetching && !initialData)
    return <div className="text-red-500">Error: {error}</div>;
  if (!session?.access) return <div>Please log in to edit this item.</div>;

  return (
    <Protected forAdmin>
      <h1 className="text-3xl font-bold mb-6">Edit Menu Item</h1>
      {initialData ? (
        <MenuItemForm
          onSubmit={onSubmit}
          initialData={initialData}
          currentImageUrl={currentImageUrl}
          isLoading={isLoading}
          error={error}
          onCancel={() => router.back()}
          submitButtonText="Save Changes"
        />
      ) : (
        !error && <div>Menu item data could not be loaded.</div>
      )}
    </Protected>
  );
}
