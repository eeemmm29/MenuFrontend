import { routes } from "@/config/routes";
import { MenuItem } from "@/types/backend/menuItems";
import { getMenuItemById, updateMenuItem } from "@/utils/backend/menuItems";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import FullScreenSpinner from "../common/FullScreenSpinner";
import MenuItemForm, { MenuItemFormData } from "./form";

export default function EditMenuItem() {
  const { id } = useParams();
  const menuItemId = Number(id);
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); // Submission loading
  const [isFetching, setIsFetching] = useState(true); // Initial data fetching
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<MenuItemFormData>();
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
            isAvailable: data.isAvailable, // Fetch isAvailable
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

    // Create FormData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("category", String(data.category));
    formData.append("isAvailable", String(data.isAvailable));

    // Append image only if a new one is selected
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      // Use updateMenuItem with FormData
      await updateMenuItem(menuItemId, formData, token);
      router.push(routes.menuItemDetail(menuItemId));
    } catch (err: any) {
      console.error("Failed to update menu item:", err);
      setError(err.message || "An unexpected error occurred while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching)
    return <FullScreenSpinner label="Loading menu item data..." />;
  if (error && !isFetching && !initialData)
    return <div className="text-red-500">Error: {error}</div>;
  if (!session?.access) return <div>Please log in to edit this item.</div>;

  return (
    <>
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
    </>
  );
}
