"use client";

import { routes } from "@/config/routes";
import { MenuItem } from "@/types/backend/menuItems";
import { getCategoryById } from "@/utils/backend/categories"; // Import function to fetch category
import { deleteMenuItem, getMenuItemById } from "@/utils/backend/menuItems";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (menuItemId) {
      setIsLoading(true);
      getMenuItemById(menuItemId)
        .then((data) => {
          setMenuItem(data);
          setError(null);
          // Fetch category details once menu item is loaded
          if (data.category) {
            getCategoryById(data.category)
              .then((catData) => setCategoryName(catData.name))
              .catch(() => setCategoryName("Unknown Category"));
          }
        })
        .catch((err) => {
          console.error("Failed to fetch menu item:", err);
          setError(err.message || "Failed to load menu item details.");
          setMenuItem(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError("Invalid menu item ID.");
      setIsLoading(false);
    }
  }, [menuItemId]);

  const handleDelete = async () => {
    if (!menuItem || !session?.access) {
      setError("Cannot delete menu item. Missing data or authentication.");
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the menu item "${menuItem.name}"?`
    );
    if (confirmDelete) {
      setIsDeleting(true);
      setError(null);
      try {
        await deleteMenuItem(menuItem.id, session.access);
        router.push(routes.menuItems); // Redirect to menu items list on success
      } catch (err: any) {
        console.error("Failed to delete menu item:", err);
        setError(
          err.message || "An unexpected error occurred during deletion."
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error && !isDeleting)
    return <div className="text-red-500">Error: {error}</div>;
  if (!menuItem) return <div>Menu item not found.</div>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Menu Item Details</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
        {menuItem.image && (
          <Image
            src={menuItem.image}
            alt={menuItem.name}
            width={200} // Adjust size as needed
            height={200}
            className="mb-4 rounded"
          />
        )}
        <h2 className="text-2xl font-semibold mb-2">{menuItem.name}</h2>
        <p className="text-gray-600 mb-1">Category: {categoryName}</p>
        <p className="text-gray-800 font-medium mb-3">
          Price: ${menuItem.price.toFixed(2)}
        </p>
        <p className="text-gray-700">{menuItem.description}</p>
        {/* Add other menu item details here if any (e.g., is_available) */}
      </div>
      <div className="flex gap-4">
        <Link href={routes.editMenuItem(menuItemId)}>
          <Button color="primary">Edit Item</Button>
        </Link>
        <Button
          color="danger"
          onPress={handleDelete}
          isDisabled={isDeleting || !session?.access} // Disable if deleting or not logged in
        >
          {isDeleting ? "Deleting..." : "Delete Item"}
        </Button>
        <Button variant="flat" onPress={() => router.back()}>
          Back
        </Button>
      </div>
      {/* Display delete errors */}
      {error && isDeleting && (
        <p className="text-red-500 text-sm mt-4">{error}</p>
      )}
    </>
  );
}
