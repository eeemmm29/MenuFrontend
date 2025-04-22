import { Category } from "@/types/backend/categories";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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
