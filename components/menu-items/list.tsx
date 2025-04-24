import { routes } from "@/config/routes";
import { MenuItem } from "@/types/backend/menuItems";
import { addFavorite, removeFavorite } from "@/utils/backend/favorites";
import { getMenuItems } from "@/utils/backend/menuItems";
import { useSession } from "next-auth/react";
import { useState } from "react";
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
  const [loadingFavoriteMenuItemId, setLoadingFavoriteMenuItemId] = useState<
    number | null
  >(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  const handleToggleFavorite = async (menuItem: MenuItem) => {
    if (!session?.access || status !== "authenticated") {
      setFavoriteError("Please log in to manage favorites.");
      return;
    }

    const currentIsFavorite = menuItem.isFavorite;

    setLoadingFavoriteMenuItemId(menuItem.id);
    setFavoriteError(null);

    try {
      if (currentIsFavorite) {
        await removeFavorite(menuItem.id, session.access);
      } else {
        await addFavorite(menuItem.id, session.access);
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
        fetchFunction={() =>
          getMenuItems(categoryId, session?.access, isFavorites)
        }
        newItemPath={routes.newMenuItem}
        renderItemCardBody={renderMenuItemCardBody} // Pass the function defined above
        itemBasePath={routes.menuItems}
        showAddNewButton={!isFavorites}
      />
    </>
  );
};

export default MenuItemsList;
