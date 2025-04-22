"use client";

import Protected from "@/components/auth/protected";
import EditMenuItem from "@/components/menu-items/edit";

export default function EditMenuItemPage() {
  return (
    <Protected forAdmin>
      <EditMenuItem />
    </Protected>
  );
}
