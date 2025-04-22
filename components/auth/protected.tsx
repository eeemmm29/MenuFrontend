import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "@/config/routes";

interface ProtectedProps {
  children: React.ReactNode;
  forUnAuth?: boolean; // Route is accessible only to unauthenticated users
  forAdmin?: boolean; // Route requires admin privileges
}

const Protected: React.FC<ProtectedProps> = ({
  children,
  forUnAuth = false,
  forAdmin = false,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";
  const isUnauthenticated = status === "unauthenticated";
  const isLoading = status === "loading";
  const isAdmin = session?.user?.isAdmin ?? false;

  useEffect(() => {
    if (isLoading) {
      return; // Don't do anything while loading
    }

    // --- Logic for routes requiring unauthentication (e.g., login page) ---
    if (forUnAuth) {
      if (isAuthenticated) {
        // If user is logged in, redirect away from unauth pages
        router.push(routes.home);
      }
      // If unauthenticated, allow access (handled below by returning children)
      return;
    }

    // --- Logic for routes requiring authentication (default or specific roles) ---

    // If unauthenticated, redirect to home (or login page if you have one)
    if (isUnauthenticated) {
      router.push(routes.home); // Or potentially routes.login if defined
      return;
    }

    // If authenticated, check role requirements
    if (isAuthenticated) {
      // Check admin requirement
      if (forAdmin && !isAdmin) {
        // If admin is required but user is not admin, redirect
        console.warn("Admin access required. Redirecting..."); // Optional: Add logging or toast
        router.push(routes.home);
        return;
      }
      // Add checks for other roles here if needed (e.g., forDealer, forSeller)
    }

    // If none of the above conditions caused a redirect, access is allowed
  }, [
    status,
    session,
    router,
    forAdmin,
    forUnAuth,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    isAdmin,
  ]);

  // --- Render logic ---

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // Allow access for unauthenticated users on forUnAuth routes
  if (forUnAuth && isUnauthenticated) {
    return <>{children}</>;
  }

  // Allow access for authenticated users if conditions are met
  if (isAuthenticated) {
    if (forAdmin && isAdmin) {
      return <>{children}</>; // Admin route, user is admin
    }
    if (!forAdmin && !forUnAuth) {
      return <>{children}</>; // Default authenticated route
    }
    // Add conditions for other roles if needed
  }

  // Otherwise, render null while redirecting or if access is denied
  // The useEffect hook handles the redirection logic
  return null;
};

export default Protected;
