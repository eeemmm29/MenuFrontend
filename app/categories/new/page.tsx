"use client";

import Protected from "@/components/auth/protected";
import NewCategory from "@/components/categories/new";

export default function NewCategoryPage() {
  return (
    <Protected forAdmin>
      <NewCategory />
    </Protected>
  );
}
