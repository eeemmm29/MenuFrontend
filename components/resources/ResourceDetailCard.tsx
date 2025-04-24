import { DetailItem } from "@/types";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import Link from "next/link";
import React from "react";
import { HeartFilledIcon, HeartIcon } from "../icons";

interface ResourceDetailCardProps {
  title: string;
  imageUrl?: string | null;
  details: DetailItem[];
  editUrl: string;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  canEditDelete: boolean;
  deleteError?: string | null;
  // Favorite props
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  isFavoriteLoading?: boolean;
  onToggleFavorite?: () => Promise<void>;
  favoriteError?: string | null;
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
  // Favorite props
  showFavoriteButton = false,
  isFavorite = false,
  isFavoriteLoading = false,
  onToggleFavorite,
  favoriteError,
}) => {
  // Find the "Name" detail item
  const nameDetail = details.find((item) => item.label === "Name");
  // Filter out the "Name" detail item for the body
  const otherDetails = details.filter((item) => item.label !== "Name");

  return (
    <>
      <h1 className="flex justify-between text-3xl font-bold mb-4">
        {title}
        {showFavoriteButton && onToggleFavorite && (
          <Button
            isIconOnly
            color="danger"
            variant={isFavorite ? "solid" : "bordered"}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            onPress={onToggleFavorite}
            isLoading={isFavoriteLoading}
          >
            {isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
          </Button>
        )}
      </h1>
      <Card className="p-6 mb-6">
        {imageUrl && <Image src={imageUrl} alt={title} />}
        <CardHeader className="text-2xl font-semibold justify-between">
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
      {/* Display errors */}
      {deleteError && (
        <p className="text-red-500 text-sm mt-4">Delete Error: {deleteError}</p>
      )}
      {favoriteError && (
        <p className="text-red-500 text-sm mt-2">
          Favorite Error: {favoriteError}
        </p>
      )}
    </>
  );
};
