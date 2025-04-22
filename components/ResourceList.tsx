"use client";

import { Button, Card, CardFooter } from "@heroui/react";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Button color="primary" as={Link} href={newItemPath}>
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
                as={Link}
                href={`${itemBasePath}/${item.id}/edit`}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                as={Link}
                href={`${itemBasePath}/${item.id}`}
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
