import { Button, Card, CardFooter } from "@heroui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";
import FullScreenSpinner from "../common/FullScreenSpinner";

interface ResourceItem {
  id: number | string;
  [key: string]: any; // Allow other properties
}

interface ResourceListProps<T extends ResourceItem> {
  title: string;
  items: T[];
  isLoading?: boolean;
  newItemPath: string;
  renderItemCardBody: (item: T) => ReactNode;
  itemBasePath: string; // e.g., "/menu-items" or "/categories"
  showAddNewButton?: boolean;
}

const ResourceList = <T extends ResourceItem>({
  title,
  items,
  isLoading,
  newItemPath,
  renderItemCardBody,
  itemBasePath,
  showAddNewButton = true,
}: ResourceListProps<T>) => {
  const { data: session } = useSession();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {!isLoading && session?.user?.isAdmin && showAddNewButton && (
          <Button color="primary" as={Link} href={newItemPath}>
            Add New{" "}
            {title
              .replace("Menu ", "")
              .replace("Items", "Item")
              .replace("Categories", "Category")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <FullScreenSpinner label={`Loading ${title}...`} />
      ) : (
        <>
          {items.length === 0 && <p>No {title.toLowerCase()} found.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} shadow="sm">
                {/* RenderItemCardBody is responsible for CardHeader and CardBody content */}
                {renderItemCardBody(item)}
                <CardFooter className="justify-end space-x-2">
                  {session?.user?.isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      as={Link}
                      href={`${itemBasePath}/${item.id}/edit`}
                    >
                      Edit
                    </Button>
                  )}
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
      )}
    </>
  );
};

export default ResourceList;
