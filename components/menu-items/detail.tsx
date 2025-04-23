import { routes } from "@/config/routes";
import { MenuItem } from "@/types/backend/menuItems";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/utils/backend/favorites";
import { deleteMenuItem, getMenuItemById } from "@/utils/backend/menuItems";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FullScreenSpinner from "../common/FullScreenSpinner";
import { ResourceDetailCard } from "../resources/ResourceDetailCard";

export default function MenuItemDetail() {
  const { id } = useParams();
  const menuItemId = Number(id);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  // Fetch Menu Item and Check Favorite Status
  useEffect(() => {
    if (menuItemId) {
      setIsLoading(true);
      getMenuItemById(menuItemId)
        .then((data) => {
          setMenuItem(data);
          setFetchError(null);
          // Check favorite status only if user is logged in
          if (session?.access) {
            setIsFavoriteLoading(true);
            getFavorites(session.access)
              .then((favData) => {
                const foundFavorite = favData.results.find(
                  (fav) => fav.menuItem.id === menuItemId
                );
                if (foundFavorite) {
                  setIsFavorited(true);
                  setFavoriteId(foundFavorite.id);
                } else {
                  setIsFavorited(false);
                  setFavoriteId(null);
                }
                setFavoriteError(null);
              })
              .catch(() => {
                setFavoriteError("Could not check favorite status.");
                setIsFavorited(false);
                setFavoriteId(null);
              })
              .finally(() => setIsFavoriteLoading(false));
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
  }, [menuItemId, session]);

  const handleDelete = async () => {
    if (!menuItem || !session?.access) {
      setDeleteError(
        "Cannot delete menu item. Missing data or authentication."
      );
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the menu item "${menuItem.name}"?`
    );
    if (confirmDelete) {
      setIsDeleting(true);
      setDeleteError(null);
      try {
        if (!menuItem.id) {
          throw new Error("Menu item ID is missing.");
        }
        await deleteMenuItem(menuItem.id, session.access);
        router.push(routes.menuItems);
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

  const handleToggleFavorite = async () => {
    if (!session?.access || !menuItem) {
      setFavoriteError("Please log in to manage favorites.");
      return;
    }

    setIsFavoriteLoading(true);
    setFavoriteError(null);

    try {
      if (isFavorited && favoriteId) {
        await removeFavorite(favoriteId, session.access);
        setIsFavorited(false);
        setFavoriteId(null);
      } else {
        const newFavorite = await addFavorite(menuItem.id, session.access);
        setIsFavorited(true);
        setFavoriteId(newFavorite.id);
      }
    } catch (err: any) {
      console.error("Failed to toggle favorite:", err);
      setFavoriteError(
        err.message || "An error occurred while updating favorites."
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  if (isLoading) return <FullScreenSpinner />;
  if (fetchError)
    return <div className="text-red-500">Error: {fetchError}</div>;
  if (!menuItem) return <div>Menu item not found.</div>;

  const menuItemDetails = [
    { label: "Name", value: menuItem.name },
    {
      label: "Category",
      value: menuItem.categoryName ?? "N/A",
    },
    { label: "Price", value: `$${menuItem.price.toFixed(2)}` },
    { label: "Description", value: menuItem.description },
  ];

  return (
    <>
      <ResourceDetailCard
        title="Menu Item Details"
        imageUrl={menuItem.image}
        details={menuItemDetails}
        editUrl={routes.editMenuItem(menuItemId)}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        canEditDelete={!!session?.user?.isAdmin}
        deleteError={deleteError}
        showFavoriteButton={status === "authenticated"}
        isFavorited={isFavorited}
        isFavoriteLoading={isFavoriteLoading}
        onToggleFavorite={handleToggleFavorite}
        favoriteError={favoriteError}
      />
    </>
  );
}
