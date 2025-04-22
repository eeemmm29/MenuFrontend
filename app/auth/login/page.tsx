"use client";

import Login from "@/components/auth/login";
import Protected from "@/components/auth/protected";

export default function LoginPage() {
  return (
    <Protected forUnAuth>
      <Login />
    </Protected>
  );
}
