// app/components/UserProfile.tsx
"use client";

import Protected from "@/components/auth/protected";
import { signIn, signOut, useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <button onClick={() => signIn()}>Sign in</button>;
  }

  return (
    <Protected>
      <div>
        <p>Signed in as {session?.user?.username}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    </Protected>
  );
}
