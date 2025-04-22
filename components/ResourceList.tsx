"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { Button, Card, CardFooter } from "@heroui/react";

interface ResourceItem {
  id: number | string;
  [key: string]: any; // Allow other properties
}

interface PaginatedResponse<T> {
  results: T[];
  // Add other pagination fields if needed (count, next, previous)
}

interface ResourceListProps<T extends ResourceItem> {
  title: string;
  fetchFunction: () => Promise<PaginatedResponse<T>>;
  newItemPath: string;
  renderItemCardBody: (item: T) => ReactNode;
  itemBasePath: string; // e.g., "/menu-items" or "/categories"
}

export default function ResourceList<T extends ResourceItem>({
  title,
  fetchFunction,
  newItemPath,
  renderItemCardBody,
  itemBasePath,
}: ResourceListProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetchFunction();
      setItems(response.results);
    } catch (error) {
      console.error(`Error fetching ${title}:`, error);
      // TODO: Handle error state appropriately, maybe show a message to the user
    }
  };

  const handleEdit = (id: number | string) => {
    router.push(`${itemBasePath}/${id}/edit`);
  };

  const handleView = (id: number | string) => {
    router.push(`${itemBasePath}/${id}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Button color="primary" onPress={() => router.push(newItemPath)}>
          Add New{" "}
          {title
            .replace("Menu ", "")
            .replace("Items", "Item")
            .replace("Categories", "Category")}
        </Button>
      </div>

      {items.length === 0 && <p>No {title.toLowerCase()} found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} shadow="sm">
            {/* RenderItemCardBody is responsible for CardHeader and CardBody content */}
            {renderItemCardBody(item)}
            <CardFooter className="justify-start space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onPress={() => handleEdit(item.id)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onPress={() => handleView(item.id)}
              >
                View
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
