import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Image,
  Form,
} from "@heroui/react";
import { MenuItem } from "@/types/backend/menuItems";
import { Category } from "@/types/backend/categories";
import { getCategories } from "@/utils/backend/categories";

// Define the form data structure
export type MenuItemFormData = Omit<MenuItem, "id" | "image"> & {
  image?: FileList | null; // For file input
};

interface MenuItemFormProps {
  onSubmit: SubmitHandler<MenuItemFormData>;
  initialData?: Partial<MenuItemFormData>; // Make initialData partial for create form
  currentImageUrl?: string;
  isLoading: boolean;
  error?: string | null;
  onCancel: () => void;
  submitButtonText: string;
}

export default function MenuItemForm({
  onSubmit,
  initialData,
  currentImageUrl,
  isLoading,
  error,
  onCancel,
  submitButtonText,
}: MenuItemFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control, // Need control for Select
    formState: { errors },
  } = useForm<MenuItemFormData>();

  const selectedCategoryId = watch("category");

  // Fetch categories for the dropdown
  useEffect(() => {
    setIsCategoriesLoading(true);
    getCategories()
      .then((data) => {
        setCategories(data.results || []);
        setCategoryError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategoryError("Could not load categories for selection.");
      })
      .finally(() => {
        setIsCategoriesLoading(false);
      });
  }, []);

  // Set initial form values if provided
  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name || "");
      setValue("description", initialData.description || "");
      setValue("price", initialData.price || 0);
      setValue("category", initialData.category);
      // Image is handled separately (display only)
    }
  }, [initialData, setValue]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      {currentImageUrl && (
        <div className="mb-4">
          <p className="block text-sm font-medium text-gray-700 mb-1">
            Current Image:
          </p>
          <Image
            src={currentImageUrl}
            alt="Current menu item image"
            width={150}
            height={150}
            className="rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Image updating is not yet supported in this form.
          </p>
        </div>
      )}

      <Input
        label="Item Name"
        placeholder="Enter item name"
        {...register("name", { required: "Item name is required" })}
        isRequired
        isDisabled={isLoading}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />
      <Textarea
        label="Description"
        placeholder="Enter item description"
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
        {...register("price", {
          required: "Price is required",
          valueAsNumber: true,
          validate: (value) => value >= 0 || "Price must be non-negative",
        })}
        isRequired
        isDisabled={isLoading}
        isInvalid={!!errors.price}
        errorMessage={errors.price?.message}
      />
      <Controller
        name="category"
        control={control}
        rules={{ required: "Category is required" }}
        render={({ field }) => (
          <Select
            label="Category"
            placeholder="Select a category"
            isDisabled={
              isLoading || isCategoriesLoading || categories.length === 0
            }
            isRequired
            isLoading={isCategoriesLoading}
            selectedKeys={field.value ? [String(field.value)] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              field.onChange(selectedKey ? Number(selectedKey) : undefined);
            }}
            isInvalid={!!errors.category || !!categoryError}
            errorMessage={
              errors.category?.message || categoryError || undefined
            }
          >
            {categories.map((cat) => (
              <SelectItem key={String(cat.id)}>{cat.name}</SelectItem>
            ))}
          </Select>
        )}
      />

      {/* Image Input - Placeholder for future implementation */}
      {/* <Input
        type="file"
        label="New Image (Optional)"
        {...register("image")}
        isDisabled={isLoading}
        accept="image/*"
      /> */}

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
