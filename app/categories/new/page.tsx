"use client";

import { routes } from "@/config/routes";
import { Category } from "@/types/backend/categories";
import { createCategory } from "@/utils/backend/categories";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form"; // Import useForm

type CategoryFormData = Omit<Category, "id">;

export default function NewCategoryPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>();

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    const token = session?.access;
    if (!token) {
      setError("You must be logged in to create a category.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await createCategory(data, token); // Use data from react-hook-form
      router.push(routes.categories); // Redirect to categories list on success
    } catch (err: any) {
      console.error("Failed to create category:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Category</h1>
      {/* Use react-hook-form's handleSubmit */}
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <Input
          label="Category Name"
          placeholder="Enter category name"
          // Register the input with react-hook-form
          {...register("name", { required: "Category name is required" })}
          isRequired
          isDisabled={isLoading}
          // Display validation errors
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />
        <Textarea
          label="Description"
          placeholder="Enter category description"
          // Register the textarea with react-hook-form
          {...register("description", { required: "Description is required" })}
          isRequired
          isDisabled={isLoading}
          // Display validation errors
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
        />
        {/* Display API errors */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2 justify-end">
          <Button
            color="danger"
            variant="flat"
            onPress={() => router.back()}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" color="primary" isLoading={isLoading}>
            Create Category
          </Button>
        </div>
      </Form>
    </div>
  );
}
