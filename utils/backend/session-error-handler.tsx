import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react"; // Import useState
import { Button } from "@heroui/button"; // Assuming you use NextUI for buttons

const SessionErrorHandler = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [showSignOutPrompt, setShowSignOutPrompt] = useState(false);

  useEffect(() => {
    // Check if session exists, is not loading, and has the refresh error
    if (
      status === "authenticated" &&
      session?.error === "RefreshAccessTokenError"
    ) {
      console.log(
        "Refresh token expired or invalid. Prompting user to sign out."
      );
      setShowSignOutPrompt(true); // Show the prompt instead of signing out directly
      // signOut({ callbackUrl: "/auth/login" }); // Remove automatic sign out
    }
  }, [session, status]); // Re-run effect when session or status changes

  if (showSignOutPrompt) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4 text-lg text-center">
          Your session has expired. Please sign in again.
        </p>
        <Button
          color="primary"
          onPress={() => signOut({ callbackUrl: "/auth/login" })}
        >
          Sign In
        </Button>
      </div>
    );
  }

  // Render children if session is loading, valid, or no error occurred
  return <>{children}</>;
};

export default SessionErrorHandler;
