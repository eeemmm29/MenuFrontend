"use client";

import { ResourceDetailCard } from "@/components/ResourceDetailCard";
import { routes } from "@/config/routes";
import { MenuItem } from "@/types/backend/menuItems";
import { getCategoryById } from "@/utils/backend/categories";
import { deleteMenuItem, getMenuItemById } from "@/utils/backend/menuItems";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MenuItemDetailPage() {
  const { id } = useParams();
  const menuItemId = Number(id);
  const { data: session } = useSession();
  const router = useRouter();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [categoryName, setCategoryName] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (menuItemId) {
      setIsLoading(true);
      getMenuItemById(menuItemId)
        .then((data) => {
          setMenuItem(data);
          setFetchError(null);
          // Fetch category details once menu item is loaded
          if (data.category) {
            getCategoryById(data.category)
              .then((catData) => setCategoryName(catData.name))
              .catch(() => setCategoryName("Unknown Category"));
          } else {
            setCategoryName("N/A"); // Handle case where category is null
          }
        })
        .catch((err) => {
          console.error("Failed to fetch menu item:", err);
          setFetchError(err.message || "Failed to load menu item details.");
          setMenuItem(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setFetchError("Invalid menu item ID.");
      setIsLoading(false);
    }
  }, [menuItemId]);

  const handleDelete = async () => {
    // Added explicit check for menuItem here as well
    if (!menuItem || !session?.access) {
      setDeleteError(
        "Cannot delete menu item. Missing data or authentication."
      );
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the menu item \"${menuItem.name}\"?`
    );
    if (confirmDelete) {
      setIsDeleting(true);
      setDeleteError(null); // Clear previous delete errors
      try {
        // Added explicit check for menuItem ID
        if (!menuItem.id) {
          throw new Error("Menu item ID is missing.");
        }
        await deleteMenuItem(menuItem.id, session.access);
        router.push(routes.menuItems); // Redirect to menu items list on success
      } catch (err: any) {
        console.error("Failed to delete menu item:", err);
        setDeleteError(
          err.message || "An unexpected error occurred during deletion."
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (fetchError)
    return <div className="text-red-500">Error: {fetchError}</div>;
  // This check ensures menuItem is not null beyond this point
  if (!menuItem) return <div>Menu item not found.</div>;

  // Now menuItem is guaranteed to be non-null
  const menuItemDetails = [
    { label: "Name", value: menuItem.name },
    { label: "Category", value: categoryName },
    { label: "Price", value: `$${menuItem.price.toFixed(2)}` },
    { label: "Description", value: menuItem.description },
    // Add other details like is_available if needed
    // { label: "Available", value: menuItem.is_available ? "Yes" : "No" },
  ];

  return (
    <ResourceDetailCard
      title="Menu Item Details"
      imageUrl={menuItem.image} // Safe to access .image
      details={menuItemDetails}
      editUrl={routes.editMenuItem(menuItemId)}
      onDelete={handleDelete}
      isDeleting={isDeleting}
      canEditDelete={!!session?.user?.isAdmin}
      deleteError={deleteError}
    />
  );
}
