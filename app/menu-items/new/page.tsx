"use client";

import { routes } from "@/config/routes";
import { Category } from "@/types/backend/categories";
import { MenuItem } from "@/types/backend/menuItems";
import { getCategories } from "@/utils/backend/categories";
import { createMenuItem } from "@/utils/backend/menuItems";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form"; // Import useForm and Controller

type MenuItemFormData = Omit<MenuItem, "id">;

export default function NewMenuItemPage() {
  // Remove useState for form fields
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const router = useRouter();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    control, // Add control for Controller
    formState: { errors },
  } = useForm<MenuItemFormData>();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const response = await getCategories();
        setCategories(response.results);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Could not load categories. Please try again later.");
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Define the onSubmit handler for react-hook-form
  const onSubmit: SubmitHandler<MenuItemFormData> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Data is already in the correct format
      await createMenuItem(data);
      router.push(routes.menuItems); // Redirect to menu items list on success
    } catch (err: any) {
      console.error("Failed to create menu item:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Menu Item</h1>
      {/* Use react-hook-form's handleSubmit */}
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <Input
          label="Item Name"
          placeholder="Enter item name"
          // Register the input
          {...register("name", { required: "Item name is required" })}
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />
        <Textarea
          label="Description"
          placeholder="Enter item description"
          // Register the textarea
          {...register("description", { required: "Description is required" })}
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
        />
        <Input
          label="Price"
          placeholder="Enter price (e.g., 9.99)"
          type="number"
          step="0.01"
          min="0"
          // Register the input, converting value to number
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true, // Ensure value is treated as a number
            min: { value: 0, message: "Price must be non-negative" },
          })}
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.price}
          errorMessage={errors.price?.message}
        />
        {/* Use Controller for the Select component */}
        <Controller
          name="category"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <Select
              label="Category"
              placeholder="Select a category"
              selectedKeys={field.value ? [String(field.value)] : []}
              // Update field value on change, converting to number
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                field.onChange(selectedKey ? Number(selectedKey) : undefined);
              }}
              isRequired
              isDisabled={isLoading || isCategoriesLoading}
              isLoading={isCategoriesLoading}
              isInvalid={!!errors.category}
              errorMessage={errors.category?.message}
            >
              {categories.map((cat) => (
                <SelectItem key={cat.id}>{cat.name}</SelectItem>
              ))}
            </Select>
          )}
        />

        {/* Add Image Upload Field later if needed */}

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
            Create Menu Item
          </Button>
        </div>
      </Form>
    </div>
  );
}
