import { routes } from "@/config/routes";
import { Category } from "@/types/backend/categories";
import { getCategories } from "@/utils/backend/categories";
import { CardBody, CardHeader } from "@heroui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import ResourceList from "../resources/ResourceList";

// Define the rendering logic for a Category card body
const renderCategoryCardBody = (category: Category) => (
  <>
    <CardHeader
      as={Link}
      href={`${routes.categories}/${category.id}`}
      className="flex-col items-start px-4 pt-4 pb-0"
    >
      <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      {category.description}
    </CardBody>
  </>
);

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.results);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <ResourceList<Category>
      title="Menu Categories"
      items={categories}
      isLoading={isLoading}
      newItemPath={routes.newCategory}
      renderItemCardBody={renderCategoryCardBody}
      itemBasePath={routes.categories}
    />
  );
}
