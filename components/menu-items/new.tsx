import { routes } from "@/config/routes";
import { MenuItem } from "@/types/backend/menuItems";
import { createMenuItem } from "@/utils/backend/menuItems";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import MenuItemForm, { MenuItemFormData } from "./form";

export default function NewMenuItem() {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<MenuItemFormData> = async (data) => {
    const token = session?.access;
    if (!token) {
      setError("You must be logged in to create a menu item.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create FormData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    // Convert price to string for FormData
    formData.append("price", String(data.price));
    formData.append("category", String(data.category));
    formData.append("isAvailable", String(data.isAvailable));

    // Append image if selected
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      await createMenuItem(formData, token);
      router.push(routes.menuItems); // Redirect on success
    } catch (err: any) {
      console.error("Failed to create menu item:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Create New Menu Item</h1>
      <MenuItemForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        onCancel={() => router.back()}
        submitButtonText="Create Item"
        // No initialData or currentImageUrl for create form
      />
    </>
  );
}
