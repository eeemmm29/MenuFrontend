// app/components/UserProfile.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Protected from "@/components/Protected";

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
