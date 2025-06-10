import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.isAdmin = token.isAdmin;
      session.user.isProfileComplete = token.isProfileComplete;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.isProfileComplete = user.isProfileComplete;
      }

      // Always fetch fresh user data to ensure token is up to date
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: {
              isAdmin: true,
              isProfileComplete: true,
            },
          });

          if (dbUser) {
            token.isAdmin = dbUser.isAdmin;
            token.isProfileComplete = dbUser.isProfileComplete;
          }
        } catch (error) {
          console.error("Error fetching user data in JWT callback:", error);
        }
      }

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
