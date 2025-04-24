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
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HeartFilledIcon, HeartIcon } from "../icons";
import ResourceList from "../resources/ResourceList";

const MenuItemsList = ({ categoryId }: { categoryId?: number }) => {
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
      <>
        <CardHeader
          as={Link}
          href={`${routes.menuItems}/${item.id}`}
          className="flex-col"
        >
          {item.image && (
            <Image
              alt={item.name}
              className="aspect-video object-cover"
              src={item.image}
              isZoomed
            />
          )}
          <div className="flex flex-row items-start justify-between w-full mt-2">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            {status === "authenticated" && (
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant={isFavorite ? "solid" : "bordered"}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleFavorite(item);
                }}
                isLoading={isLoading}
              >
                {isFavorite ? (
                  <HeartFilledIcon size={18} />
                ) : (
                  <HeartIcon size={18} />
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody className="justify-between">
          <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {item.description}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-green-600">
              ${item.price.toFixed(2)}
            </p>
            <Chip
              color="success"
              className={clsx(
                item.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {item.isAvailable ? "Available" : "Not Available"}
            </Chip>
          </div>
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
      />
    </>
  );
};

export default MenuItemsList;
