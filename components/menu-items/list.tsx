import { routes } from "@/config/routes";
import { MenuItem } from "@/types/backend/menuItems";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/utils/backend/favorites";
import { getMenuItems } from "@/utils/backend/menuItems";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ResourceList from "../resources/ResourceList";
import MenuItemCardBody from "./card-body";

interface MenuItemsListProps {
  categoryId?: number;
  isFavorites?: boolean;
}

const MenuItemsList: React.FC<MenuItemsListProps> = ({
  categoryId,
  isFavorites,
}) => {
  const { data: session, status } = useSession();
  const [favoritesMap, setFavoritesMap] = useState<Map<number, number>>(
    new Map()
  ); // Map<menuItemId, favoriteId>
  const [loadingFavoriteMenuItemId, setLoadingFavoriteMenuItemId] = useState<
    number | null
  >(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  // Fetch favorites when session is available
  useEffect(() => {
    if (status === "authenticated" && session?.access) {
      getFavorites(session.access)
        .then((data) => {
          const favMap = new Map<number, number>();
          data.results.forEach((fav) => {
            favMap.set(fav.menuItem.id, fav.id);
          });
          setFavoritesMap(favMap);
        })
        .catch((err) => {
          console.error("Failed to fetch favorites:", err);
          setFavoriteError("Could not load favorite status.");
        });
    }
  }, [session, status]);

  const handleToggleFavorite = async (menuItem: MenuItem) => {
    if (!session?.access) {
      setFavoriteError("Please log in to manage favorites.");
      return;
    }

    const isCurrentlyFavorited = favoritesMap.has(menuItem.id);
    const favoriteId = favoritesMap.get(menuItem.id);

    setLoadingFavoriteMenuItemId(menuItem.id);
    setFavoriteError(null);

    try {
      if (isCurrentlyFavorited && favoriteId) {
        // Remove from favorites
        await removeFavorite(favoriteId, session.access);
        setFavoritesMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.delete(menuItem.id);
          return newMap;
        });
      } else {
        // Add to favorites
        const newFavorite = await addFavorite(menuItem.id, session.access);
        setFavoritesMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(menuItem.id, newFavorite.id);
          return newMap;
        });
      }
    } catch (err: any) {
      console.error("Failed to toggle favorite:", err);
      setFavoriteError(
        err.message || "An error occurred while updating favorites."
      );
      // Optionally revert state on error, or show persistent error
    } finally {
      setLoadingFavoriteMenuItemId(null);
    }
  };

  const renderMenuItemCardBody = (item: MenuItem) => {
    const isFavorite = favoritesMap.has(item.id);
    const isLoading = loadingFavoriteMenuItemId === item.id;

    return (
      <MenuItemCardBody
        item={item}
        isLoading={isLoading}
        isAuthenticated={status === "authenticated"}
        isFavorite={isFavorite}
        toggleFavorite={handleToggleFavorite}
      />
    );
  };

  const title = isFavorites
    ? "Your Favorite Menu Items"
    : categoryId
      ? "Menu Items in this Category"
      : "Menu Items";

  return (
    <>
      {/* Display favorite error globally for the list */}
      {favoriteError && (
        <p className="text-red-500 text-sm mb-4">Error: {favoriteError}</p>
      )}
      <ResourceList<MenuItem>
        title={title}
        fetchFunction={() => getMenuItems(categoryId, isFavorites)}
        newItemPath={routes.newMenuItem}
        renderItemCardBody={renderMenuItemCardBody} // Pass the function defined above
        itemBasePath={routes.menuItems}
        showAddNewButton={!isFavorites}
      />
    </>
  );
};

export default MenuItemsList;
