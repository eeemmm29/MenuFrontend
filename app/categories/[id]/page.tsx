"use client";

import { ResourceDetailCard } from "@/components/ResourceDetailCard";
import { routes } from "@/config/routes";
import { Category } from "@/types/backend/categories";
import { deleteCategory, getCategoryById } from "@/utils/backend/categories";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryDetailPage() {
  const { id } = useParams();
  const categoryId = Number(id);
  const { data: session } = useSession();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (categoryId) {
      setIsLoading(true);
      getCategoryById(categoryId)
        .then((data) => {
          setCategory(data);
          setFetchError(null);
        })
        .catch((err) => {
          console.error("Failed to fetch category:", err);
          setFetchError(err.message || "Failed to load category details.");
          setCategory(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setFetchError("Invalid category ID.");
      setIsLoading(false);
    }
  }, [categoryId]);

  const handleDelete = async () => {
    if (!category || !session?.access) {
      setDeleteError("Cannot delete category. Missing data or authentication.");
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the category "${category.name}"?`
    );
    if (confirmDelete) {
      setIsDeleting(true);
      setDeleteError(null); // Clear previous delete errors
      try {
        await deleteCategory(category.id, session.access);
        router.push(routes.categories); // Redirect to categories list on success
      } catch (err: any) {
        console.error("Failed to delete category:", err);
        setDeleteError(
          err.message || "An unexpected error occurred during deletion."
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (fetchError)
    return <div className="text-red-500">Error: {fetchError}</div>;
  if (!category) return <div>Category not found.</div>;

  const categoryDetails = [{ label: "Name", value: category.name }]; // Add more details if they exist

  return (
    <ResourceDetailCard
      title="Category Details"
      details={categoryDetails}
      editUrl={routes.editCategory(categoryId)}
      onDelete={handleDelete}
      isDeleting={isDeleting}
      canEditDelete={!!session?.user?.isAdmin}
      onBack={() => router.back()}
      deleteError={deleteError}
    />
  );
}
