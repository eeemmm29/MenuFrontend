import { routes } from "@/config/routes";
import { MenuItem } from "@/types/backend/menuItems";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/utils/backend/favorites";
import { getMenuItems } from "@/utils/backend/menuItems";
import { Button } from "@heroui/button";
import { CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HeartFilledIcon, HeartIcon } from "../icons";
import ResourceList from "../resources/ResourceList";

export default function MenuItemsList({ categoryId }: { categoryId?: number }) {
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

  // Define render function inside the component to access state/handlers
  const renderMenuItemCardBody = (item: MenuItem) => {
    const isFavorited = favoritesMap.has(item.id);
    const isLoading = loadingFavoriteMenuItemId === item.id;

    return (
      <>
        <CardHeader
          as={Link}
          href={`${routes.menuItems}/${item.id}`}
          className="flex-row items-start justify-between px-4 pt-4 pb-0"
        >
          {item.image && (
            <Image
              removeWrapper
              alt={item.name}
              className="z-0 w-full h-[140px] object-cover rounded-md mb-4"
              src={item.image}
            />
          )}
          <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
          {status === "authenticated" && (
            <Button
              isIconOnly
              size="sm"
              color="danger"
              variant={isFavorited ? "solid" : "bordered"}
              aria-label={
                isFavorited ? "Remove from favorites" : "Add to favorites"
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleFavorite(item);
              }}
              isLoading={isLoading}
            >
              {isFavorited ? (
                <HeartFilledIcon size={18} />
              ) : (
                <HeartIcon size={18} />
              )}
            </Button>
          )}
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <p className="text-gray-600 mb-2">{item.description}</p>
          <p className="text-lg font-semibold text-green-600 mb-4">
            ${item.price.toFixed(2)}
          </p>
        </CardBody>
      </>
    );
  };

  const title = categoryId ? "Menu Items in this Category" : "Menu Items";

  return (
    <>
      {/* Display favorite error globally for the list */}
      {favoriteError && (
        <p className="text-red-500 text-sm mb-4">Error: {favoriteError}</p>
      )}
      <ResourceList<MenuItem>
        title={title}
        fetchFunction={() => getMenuItems(categoryId)}
        newItemPath={routes.newMenuItem}
        renderItemCardBody={renderMenuItemCardBody} // Pass the function defined above
        itemBasePath={routes.menuItems}
        // Removed favorite props from here
      />
    </>
  );
}
