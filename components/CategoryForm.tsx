"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Input, Form } from "@heroui/react";
import { Category } from "@/types/backend/categories";

export type CategoryFormData = Omit<Category, "id">;

interface CategoryFormProps {
  onSubmit: SubmitHandler<CategoryFormData>;
  initialData?: CategoryFormData;
  isLoading: boolean;
  error?: string | null;
  onCancel: () => void;
  submitButtonText: string;
}

export default function CategoryForm({
  onSubmit,
  initialData,
  isLoading,
  error,
  onCancel,
  submitButtonText,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>();

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
    }
  }, [initialData, setValue]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <Input
        label="Category Name"
        placeholder="Enter category name"
        {...register("name", { required: "Category name is required" })}
        isRequired
        isDisabled={isLoading}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2 justify-end">
        <Button
          color="danger"
          variant="flat"
          onPress={onCancel}
          isDisabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" color="primary" isLoading={isLoading}>
          {submitButtonText}
        </Button>
      </div>
    </Form>
  );
}
