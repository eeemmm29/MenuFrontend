"use client";

import Protected from "@/components/auth/protected";
import SignUp from "@/components/auth/signup";

export default function SignUpPage() {
  return (
    <Protected forUnAuth>
      <SignUp />
    </Protected>
  );
}
