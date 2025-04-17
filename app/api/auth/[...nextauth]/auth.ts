import axios from "axios";
import NextAuth from "next-auth";
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
      // If this is a login, attach the tokens.
      if (user) {
        token.access = user.access;
        token.refresh = user.refresh;
        token.user = user;
      }
      // Optionally implement token refreshing here if expired
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;
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
