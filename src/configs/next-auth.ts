import { PrismaAdapter } from "@auth/prisma-adapter"

import type { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"

import { db } from "@/lib/prisma"

import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

// Extend NextAuth's Session and User interfaces to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      name: string
      image: string | null
    }
  }

  interface User {
    id: string
    email: string | null
    name: string
    image: string | null
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string | null
    name: string
    image: string | null
  }
}

// Configuration for NextAuth with custom adapters and providers
// NextAuth.js documentation: https://next-auth.js.org/getting-started/introduction
export const authOptions: NextAuthOptions = {
  // Use Prisma adapter for database interaction
  // More info: https://next-auth.js.org/getting-started/adapter
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth", // Custom sign in page
  },
  session: {
    strategy: "jwt", // Use JWT strategy for sessions
    maxAge: 30 * 24 * 60 * 60, // Set session expiration to 30 days
    // More info on session strategies: https://next-auth.js.org/getting-started/options#session
  },
  callbacks: {
    // Callback to add custom user properties to JWT
    // Learn more: https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, user }) {
      if (user) {
        // Persist the user info to the token right after signin
        token.id = user.id
        token.name = user.name
        token.image = user.image
        token.email = user.email
      }

      return token
    },
    // Callback to include JWT properties in the session object
    // Learn more: https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token }) {
      if (session.user) {
        // Send properties to the client, like the user info from a provider.
        session.user.id = token.id
        session.user.name = token.name
        session.user.image = token.image
        session.user.email = token.email
      }

      return session
    },
  },
}
