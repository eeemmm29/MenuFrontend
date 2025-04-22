"use client";

import Protected from "@/components/auth/protected";
import NewMenuItem from "@/components/menu-items/new";

export default function NewMenuItemPage() {
  return (
    <Protected forAdmin>
      <NewMenuItem />
    </Protected>
  );
}
