"use client";

import Protected from "@/components/auth/protected";
import FavoritesList from "@/components/favorites/list";

export default function FavoritesPage() {
  return (
    <Protected>
      <FavoritesList />
    </Protected>
  );
}
