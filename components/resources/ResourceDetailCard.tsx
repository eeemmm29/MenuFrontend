import { DetailItem } from "@/types";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import Link from "next/link";
import React from "react";

interface ResourceDetailCardProps {
  title: string;
  imageUrl?: string | null;
  details: DetailItem[];
  editUrl: string;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  canEditDelete: boolean;
  deleteError?: string | null;
}

export const ResourceDetailCard: React.FC<ResourceDetailCardProps> = ({
  title,
  imageUrl,
  details,
  editUrl,
  onDelete,
  isDeleting,
  canEditDelete,
  deleteError,
}) => {
  // Find the "Name" detail item
  const nameDetail = details.find((item) => item.label === "Name");
  // Filter out the "Name" detail item for the body
  const otherDetails = details.filter((item) => item.label !== "Name");

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <Card className="p-6 mb-6">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            width={200} // Adjust size as needed
            height={200}
            className="mb-4 rounded"
          />
        )}
        <CardHeader className="text-2xl font-semibold">
          {nameDetail?.value || title}
        </CardHeader>
        <CardBody>
          {otherDetails.map((item) =>
            item.value !== undefined ? (
              <p key={item.label}>
                <span className="font-medium">{item.label}:</span> {item.value}
              </p>
            ) : null
          )}
        </CardBody>
        <CardFooter className="flex gap-4">
          {canEditDelete && (
            <>
              <Link href={editUrl}>
                <Button color="primary">Edit</Button>
              </Link>
              <Button color="danger" onPress={onDelete} isDisabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      {/* Display delete errors */}
      {deleteError && (
        <p className="text-red-500 text-sm mt-4">{deleteError}</p>
      )}
    </>
  );
};
