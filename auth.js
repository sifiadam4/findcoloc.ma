import NextAuth from "next-auth"
import authConfig from "./auth.config"
 
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"


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
      })
    }
  },
  callbacks: {
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id
      }

      return session
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})