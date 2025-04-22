import { routes } from "@/config/routes";
import { getCategoryById, updateCategory } from "@/utils/backend/categories";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import CategoryForm, { CategoryFormData } from "./form";

export default function EditCategory() {
  const { id } = useParams();
  const categoryId = Number(id);
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); // For submission loading state
  const [isFetching, setIsFetching] = useState(true); // For initial data fetching
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<CategoryFormData | undefined>(
    undefined
  );

  // Fetch category data on component mount
  useEffect(() => {
    if (categoryId && session?.access) {
      setIsFetching(true);
      getCategoryById(categoryId)
        .then((data) => {
          setInitialData({ name: data.name, description: data.description }); // Set initial data for the form
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to fetch category for editing:", err);
          setError(err.message || "Failed to load category data.");
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else if (!session?.access) {
      setError("You must be logged in to edit a category.");
      setIsFetching(false);
    } else {
      setError("Invalid category ID.");
      setIsFetching(false);
    }
  }, [categoryId, session]);

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    const token = session?.access;
    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }
    if (!categoryId) {
      setError("Category ID is missing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await updateCategory(categoryId, data, token);
      router.push(routes.categoryDetail(categoryId)); // Redirect to detail view on success
    } catch (err: any) {
      console.error("Failed to update category:", err);
      setError(err.message || "An unexpected error occurred while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div>Loading category data...</div>;
  if (error && !isFetching && !initialData)
    return <div className="text-red-500">Error: {error}</div>;
  if (!session?.access) return <div>Please log in to edit this category.</div>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      {initialData ? (
        <CategoryForm
          onSubmit={onSubmit}
          initialData={initialData}
          isLoading={isLoading}
          error={error} // Pass submission error
          onCancel={() => router.back()}
          submitButtonText="Save Changes"
        />
      ) : (
        // Show error if fetching succeeded but data is still missing (shouldn't happen ideally)
        !error && <div>Category data could not be loaded.</div>
      )}
    </>
  );
}
