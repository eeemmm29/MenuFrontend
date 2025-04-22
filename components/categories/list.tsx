import { Category } from "@/types/backend/categories";
import { getCategories } from "@/utils/backend/categories";
import { CardHeader } from "@heroui/react";
import ResourceList from "../resources/ResourceList";

// Define the rendering logic for a Category card body
const renderCategoryCardBody = (category: Category) => (
  <CardHeader className="flex-col items-start px-4 pt-4 pb-0">
    <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
  </CardHeader>
);

export default function CategoriesList() {
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
