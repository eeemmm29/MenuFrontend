"use client";

import { routes } from "@/config/routes";
import { Category } from "@/types/backend/categories";
import { deleteCategory, getCategoryById } from "@/utils/backend/categories";
import { Button } from "@heroui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryDetailPage() {
  const { id } = useParams();
  const categoryId = Number(id);
  const { data: session } = useSession();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (categoryId) {
      setIsLoading(true);
      getCategoryById(categoryId)
        .then((data) => {
          setCategory(data);
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to fetch category:", err);
          setError(err.message || "Failed to load category details.");
          setCategory(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError("Invalid category ID.");
      setIsLoading(false);
    }
  }, [categoryId]);

  const handleDelete = async () => {
    if (!category || !session?.access) {
      setError("Cannot delete category. Missing data or authentication.");
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the category "${category.name}"?`
    );
    if (confirmDelete) {
      setIsDeleting(true);
      setError(null);
      try {
        await deleteCategory(category.id, session.access);
        router.push(routes.categories); // Redirect to categories list on success
      } catch (err: any) {
        console.error("Failed to delete category:", err);
        setError(
          err.message || "An unexpected error occurred during deletion."
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>; // Keep simple divs for loading/error states
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!category) return <div>Category not found.</div>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Category Details</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>
        {/* Add other category details here if any */}
      </div>
      <div className="flex gap-4">
        <Link href={routes.editCategory(categoryId)}>
          <Button color="primary">Edit Category</Button>
        </Link>
        <Button
          color="danger"
          onPress={handleDelete}
          isDisabled={isDeleting || !session?.access} // Disable if deleting or not logged in
        >
          {isDeleting ? "Deleting..." : "Delete Category"}
        </Button>
        <Button variant="flat" onPress={() => router.back()}>
          Back
        </Button>
      </div>
      {/* Display delete errors */}
      {error && !isLoading && (
        <p className="text-red-500 text-sm mt-4">{error}</p>
      )}
    </>
  );
}
