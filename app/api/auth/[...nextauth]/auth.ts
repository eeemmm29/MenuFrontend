import axios from "axios";
import NextAuth, { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

// Helper function to get the backend URL
const getBackendUrl = () => {
  const internalUrl = process.env.INTERNAL_BACKEND_URL?.trim();
  const publicUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

  if (internalUrl) {
    console.log("Using INTERNAL_BACKEND_URL:", internalUrl);
    return internalUrl;
  }
  if (publicUrl) {
    console.log("Using NEXT_PUBLIC_BACKEND_URL:", publicUrl);
    return publicUrl;
  }
  console.error(
    "ERROR: Neither INTERNAL_BACKEND_URL nor NEXT_PUBLIC_BACKEND_URL is defined!"
  );
  return null; // Indicate failure
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const backendUrl = getBackendUrl();
        if (!backendUrl) {
          console.error("Authorization failed: Backend URL is not configured.");
          return null;
        }
        const res = await axios.post(`${backendUrl}/auth/login`, {
          username: credentials.username,
          password: credentials.password,
        });
        if (res.data?.access) {
          // Return the user object along with the tokens.
          return {
            ...res.data.user,
            access: res.data.access,
            refresh: res.data.refresh,
            accessExpiration: res.data.accessExpiration,
            refreshExpiration: res.data.refreshExpiration,
            isAdmin: res.data.user.isAdmin,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      // Initial sign in
      if (account && user) {
        // Separate user data from token data received from authorize
        token.user = {
          id: user.id,
          username: user.username,
          email: user.email, // Add other user fields as needed
          isAdmin: user.isAdmin,
        };
        token.access = user.access;
        token.refresh = user.refresh;
        token.accessExpiration = new Date(user.accessExpiration).getTime();
        token.refreshExpiration = new Date(user.refreshExpiration).getTime();
        // Clear the error on successful sign-in
        delete token.error;
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessExpiration) {
        return token;
      }

      // Access token has expired, try to refresh it
      return refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      // Send properties to the client, like user details and current tokens/error
      session.user = token.user as User; // User details
      session.access = token.access; // Current access token
      session.refresh = token.refresh; // Current refresh token
      session.error = token.error as string | undefined; // Any token refresh error

      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // your custom login page
    error: "/auth/error", // error display page
  },
});

const refreshAccessToken = async (token: JWT) => {
  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    console.error("Token refresh failed: Backend URL is not configured.");
    return { ...token, error: "BackendUrlNotConfigured" };
  }

  try {
    const response = await axios.post(`${backendUrl}/auth/token/refresh`, {
      refresh: token.refresh,
    });

    if (response.data?.access) {
      return {
        ...token,
        access: response.data.access,
        accessExpiration: new Date(response.data.accessExpiration).getTime(),
        refresh: response.data.refresh ?? token.refresh,
        error: undefined, // Clear previous errors
      };
    }

    throw new Error(
      "Failed to refresh access token: No access token in response"
    );
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError", // Signifies refresh failure
    };
  }
};
