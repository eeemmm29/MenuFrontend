"use client";

import { getCategories } from "@/utils/backend/categories";
import ResourceList from "@/components/ResourceList"; // Import the new component
import { CardBody, CardHeader } from "@heroui/react"; // Import necessary components for rendering

// Define a simple Category type locally or import if defined elsewhere
interface Category {
  id: number;
  name: string;
  description: string;
}

// Define the rendering logic for a Category card body
const renderCategoryCardBody = (category: Category) => (
  <>
    <CardHeader className="flex-col items-start px-4 pt-4 pb-0">
      <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <p className="text-gray-600 mb-4">{category.description}</p>
    </CardBody>
  </>
);

export default function CategoriesPage() {
  return (
    <ResourceList<Category>
      title="Menu Categories"
      fetchFunction={getCategories}
      newItemPath="/categories/new"
      renderItemCardBody={renderCategoryCardBody}
      itemBasePath="/categories"
    />
  );
}
