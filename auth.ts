import NextAuth, { Session } from "next-auth";
import { type JWT } from "next-auth/jwt";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ token, session }: { session: Session; token?: JWT }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
