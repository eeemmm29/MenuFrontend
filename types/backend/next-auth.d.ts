import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    access?: string;
    refresh?: string;
    // Optionally, if you add properties to the user, merge them here.
    user: DefaultSession["user"] & {
      id?: string;
      access?: string;
      refresh?: string;
    };
  }

  interface User extends DefaultUser {
    access: string;
    refresh: string;
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    access?: string;
    refresh?: string;
  }
}
