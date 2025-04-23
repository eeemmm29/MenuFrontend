import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface CustomUser {
    id?: string;
    username?: string;
    access: string;
    refresh: string;
    accessExpiration: string;
    refreshExpiration: string;
    isAdmin?: boolean;
  }

  interface User extends DefaultUser, CustomUser {}
  interface Session extends DefaultSession {
    access?: string;
    refresh?: string;
    user: User & AdaptedUser;
    error?: string;
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    user?: User;
    access: string;
    refresh: string;
    accessExpiration: number;
    refreshExpiration: number;
  }
}
