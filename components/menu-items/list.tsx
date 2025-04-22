import { routes } from "@/config/routes";
import { MenuItem } from "@/types/backend/menuItems";
import { getMenuItems } from "@/utils/backend/menuItems";
import { CardBody, CardHeader, Image } from "@heroui/react";
import Link from "next/link";
import ResourceList from "../resources/ResourceList";

// Define the rendering logic for a MenuItem card body
const renderMenuItemCardBody = (item: MenuItem) => (
  <>
    <CardHeader
      as={Link}
      href={`${routes.menuItems}/${item.id}`}
      className="flex-col items-start px-4 pt-4 pb-0"
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
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <p className="text-gray-600 mb-2">{item.description}</p>
      <p className="text-lg font-semibold text-green-600 mb-4">
        ${item.price.toFixed(2)}
      </p>
    </CardBody>
  </>
);

export default function MenuItemsList() {
  return (
    <ResourceList<MenuItem>
      title="Menu Items"
      fetchFunction={getMenuItems}
      newItemPath={routes.newMenuItem}
      renderItemCardBody={renderMenuItemCardBody}
      itemBasePath={routes.menuItems}
    />
  );
}
