"use client";

import Protected from "@/components/auth/protected";
import EditCategory from "@/components/categories/edit";

export default function EditCategoryPage() {
  return (
    <Protected forAdmin>
      <EditCategory />
    </Protected>
  );
}
