import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const res = await axios({
          url: process.env.NEXT_PUBLIC_BACKEND_URL + "auth/login",
          method: "post",
          data: credentials,
        });
        if (res.data?.access) {
          // Return the user object along with the tokens.
          return res.data;
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
      // session.user = token.user;
      session.access = token.access;
      session.refresh = token.refresh;
      return session;
    },
  },
});
