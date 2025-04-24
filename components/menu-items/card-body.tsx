import { routes } from "@/config/routes";
import { MenuItem } from "@/types/backend/menuItems";
import { Button } from "@heroui/button";
import { CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import clsx from "clsx";
import Link from "next/link";
import { HeartFilledIcon, HeartIcon } from "../icons";

interface MenuItemCardBodyProps {
  item: MenuItem;
  isLoading?: boolean;
  isAuthenticated: boolean;
  toggleFavorite: (item: MenuItem) => Promise<void>;
}

const MenuItemCardBody: React.FC<MenuItemCardBodyProps> = ({
  item,
  isLoading,
  isAuthenticated,
  toggleFavorite,
}) => {
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
          {isAuthenticated && (
            <Button
              isIconOnly
              size="sm"
              color="danger"
              variant={item.isFavorite ? "solid" : "bordered"}
              aria-label={
                item.isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(item);
              }}
              isLoading={isLoading}
            >
              {item.isFavorite ? (
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

export default MenuItemCardBody;
