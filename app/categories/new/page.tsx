"use client";

import CategoryForm, { CategoryFormData } from "@/components/CategoryForm";
import { routes } from "@/config/routes";
import { createCategory } from "@/utils/backend/categories";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import Protected from "@/components/Protected";

export default function NewCategoryPage() {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    const token = session?.access;
    if (!token) {
      setError("You must be logged in to create a category.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await createCategory(data, token);
      router.push(routes.categories); // Redirect to categories list on success
    } catch (err: any) {
      console.error("Failed to create category:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Protected forAdmin>
      <h1 className="text-3xl font-bold mb-6">Create New Category</h1>
      <CategoryForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        onCancel={() => router.back()}
        submitButtonText="Create Category"
      />
    </Protected>
  );
}
