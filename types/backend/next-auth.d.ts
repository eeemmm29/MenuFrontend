import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    access?: string;
    refresh?: string;
    user: DefaultSession["user"] & CustomUser;
  }

  interface CustomUser {
    id?: string;
    username?: string;
    access?: string;
    refresh?: string;
  }

  interface User extends DefaultUser, CustomUser {}
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    user?: CustomUser;
    access?: string;
    refresh?: string;
  }
}
