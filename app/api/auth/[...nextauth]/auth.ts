import axios from "axios";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

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
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            username: credentials.username,
            password: credentials.password,
          }
        );
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
    jwt: async ({ token, user }) => {
      // If this is a login, attach the tokens and user info.
      if (user) {
        token.access = user.access;
        token.refresh = user.refresh;
        token.accessExpiration = new Date(user.accessExpiration).getTime();
        token.refreshExpiration = new Date(user.refreshExpiration).getTime();
        token.user = user;
      }

      // Return previous token if the access token has not expired
      if (Date.now() < token.accessExpiration) {
        return token;
      }

      // Access token has expired, try to refresh it
      return await refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      // Pass user info from token to session
      if (token.user) {
        session.user = token.user;
      }
      session.access = token.access;
      session.refresh = token.refresh;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // your custom login page
    error: "/auth/error", // error display page
  },
});

async function refreshAccessToken(token: JWT) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/token/refresh`,
      {
        refresh: token.refresh,
      }
    );

    if (response.data?.access) {
      return {
        ...token,
        accessToken: response.data.access,
        accessTokenExpires: response.data.accessExpiration,
        refresh: response.data.refresh ?? token.refresh, // Fall back to old refresh token
      };
    }

    throw new Error("Failed to refresh access token");
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
