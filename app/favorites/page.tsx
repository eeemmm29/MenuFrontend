"use client";

import Protected from "@/components/auth/protected";
import MenuItemsList from "@/components/menu-items/list";

export default function FavoritesPage() {
  return (
    <Protected>
      <MenuItemsList isFavorites />
    </Protected>
  );
}
