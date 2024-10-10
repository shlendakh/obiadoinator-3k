import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// const GITHUB_ID = process.env.GITHUB_ID || "";
// const GITHUB_SECRET = process.env.GITHUB_SECRET || "";

export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: "database",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: { scope: "read:user user:email" },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username:",
          type: "text",
          placeholder: "your-name",
        },
        password: {
          label: "Password:",
          type: "text",
          placeholder: "your-password",
        },
      },
      async authorize(credentials) {
        const user = { id: "42", name: "admin", password: "admin1" };

        if (
          credentials?.username === user.name &&
          credentials?.password === user.password
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
