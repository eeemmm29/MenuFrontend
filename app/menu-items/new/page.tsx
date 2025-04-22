"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SubmitHandler } from "react-hook-form";
import { createMenuItem } from "@/utils/backend/menuItems";
import { routes } from "@/config/routes";
import MenuItemForm, { MenuItemFormData } from "@/components/MenuItemForm";

export default function NewMenuItemPage() {
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

    // Convert price to number if it's a string (should be handled by react-hook-form valueAsNumber)
    const priceAsNumber =
      typeof data.price === "string" ? parseFloat(data.price) : data.price;

    // Prepare payload, ensuring category is a number
    const payload: Omit<MenuItem, "id" | "image"> = {
      ...data,
      price: priceAsNumber,
      category: Number(data.category),
    };

    // TODO: Handle image upload separately if needed

    try {
      await createMenuItem(payload, token);
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
