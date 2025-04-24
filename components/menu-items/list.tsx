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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingFavoriteMenuItemId, setLoadingFavoriteMenuItemId] = useState<
    number | null
  >(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        let results: MenuItem[] = [];
        if (isFavorites) {
          if (!session?.access || status !== "authenticated") {
            setFavoriteError("Please log in to view favorites.");
            return;
          }
          const response = await getFavorites(session?.access);
          results = response.results.map((favorite) => favorite.menuItem);
        } else {
          const response = await getMenuItems(categoryId, session?.access);
          results = response.results;
        }
        setMenuItems(results);
      } catch (error) {
        console.error("Failed to load menu items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuItems();
  }, [categoryId, isFavorites, session?.access]);

  const handleToggleFavorite = async (menuItem: MenuItem) => {
    if (!session?.access || status !== "authenticated") {
      setFavoriteError("Please log in to manage favorites.");
      return;
    }

    setLoadingFavoriteMenuItemId(menuItem.id);
    setFavoriteError(null);

    try {
      if (menuItem.isFavorite) {
        await removeFavorite(menuItem.id, session.access);
      } else {
        await addFavorite(menuItem.id, session.access);
      }

      // Update the local state to reflect the new favorite status
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === menuItem.id
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        )
      );
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
    const isLoading = loadingFavoriteMenuItemId === item.id;

    return (
      <MenuItemCardBody
        item={item}
        isLoading={isLoading}
        isAuthenticated={status === "authenticated"}
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
      {favoriteError && (
        <p className="text-red-500 text-sm mb-4">Error: {favoriteError}</p>
      )}
      <ResourceList<MenuItem>
        title={title}
        items={menuItems}
        isLoading={isLoading}
        newItemPath={routes.newMenuItem}
        renderItemCardBody={renderMenuItemCardBody}
        itemBasePath={routes.menuItems}
        showAddNewButton={!isFavorites}
      />
    </>
  );
};

export default MenuItemsList;
