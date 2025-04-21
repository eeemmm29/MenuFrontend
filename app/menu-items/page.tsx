"use client";

import { MenuItem } from "@/types/backend/menuItems";
import { getMenuItems } from "@/utils/backend/menuItems";
import ResourceList from "@/components/ResourceList"; // Import the new component
import { CardBody, CardHeader, Image } from "@heroui/react"; // Import necessary components for rendering

// Define the rendering logic for a MenuItem card body
const renderMenuItemCardBody = (item: MenuItem) => (
  <>
    <CardHeader className="flex-col items-start px-4 pt-4 pb-0">
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

export default function MenuItemsPage() {
  return (
    <ResourceList<MenuItem>
      title="Menu Items"
      fetchFunction={getMenuItems}
      newItemPath="/menu-items/new"
      renderItemCardBody={renderMenuItemCardBody}
      itemBasePath="/menu-items"
    />
  );
}
