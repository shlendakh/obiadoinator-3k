import GithubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook";

// Session configuration constants
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
const SESSION_UPDATE_AGE = 24 * 60 * 60; // 24 hours in seconds

/**
 * Configuration of NextAuth options, which defines the way sessions and authentication providers are managed.
 * Uses the Prisma adapter to store session data in the database.
 *
 * @see https://next-auth.js.org/getting-started/introduction
 */
export const authOptions: NextAuthOptions = {
  // Using Prisma adapter to manage session data in the database
  adapter: PrismaAdapter(prisma),

  /**
   * Session configuration
   *
   * @property {string} strategy - Session strategy. "database" means that sessions are stored in the database.
   * @property {number} maxAge - The maximum duration of a session in seconds (30 days).
   * @property {number} updateAge - The time after which the session will be refreshed, in seconds (24 hours).
   */
  session: {
    strategy: "database",
    maxAge: SESSION_MAX_AGE,
    updateAge: SESSION_UPDATE_AGE,
  },

  /**
   * Authentication providers. Currently, GitHub and Google are used.
   * Each provider requires a Client ID and Secret, which are provided via environment variables.
   *
   * @see https://next-auth.js.org/providers/github
   * @see https://next-auth.js.org/providers/google
   */
  providers: [
    GithubProvider({
      clientId: (() => {
        if (!process.env.GITHUB_ID)
          throw new Error("Missing GITHUB_ID environment variable");
        return process.env.GITHUB_ID;
      })(),
      clientSecret: (() => {
        if (!process.env.GITHUB_SECRET)
          throw new Error("Missing GITHUB_SECRET environment variable");
        return process.env.GITHUB_SECRET;
      })(),
    }),
    GoogleProvider({
      clientId: (() => {
        if (!process.env.GOOGLE_CLIENT_ID)
          throw new Error("Missing GOOGLE_CLIENT_ID environment variable");
        return process.env.GOOGLE_CLIENT_ID;
      })(),
      clientSecret: (() => {
        if (!process.env.GOOGLE_CLIENT_SECRET)
          throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable");
        return process.env.GOOGLE_CLIENT_SECRET;
      })(),
    }),
    // FacebookProvider({
    //   clientId: (() => {
    //     if (!process.env.FACEBOOK_CLIENT_ID)
    //       throw new Error("Missing GOOGLE_CLIENT_ID environment variable");
    //     return process.env.FACEBOOK_CLIENT_ID;
    //   })(),
    //   clientSecret: (() => {
    //     if (!process.env.FACEBOOK_CLIENT_SECRET)
    //       throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable");
    //     return process.env.FACEBOOK_CLIENT_SECRET;
    //   })(),
    // }),
  ],

  /**
   * Callbacks to handle different stages of the authentication process.
   * Includes session and sign-in callbacks to manage custom behavior.
   */
  callbacks: {
    /**
     * Session callback to log session and user information.
     * This function can be used to modify the session object before it is returned.
     *
     * @param {object} session - The current session object.
     * @returns {object} - The session object to be returned.
     */
    async session({ session }) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("Session: ", session);
      }
      return session;
    },

    /**
     * Sign-in callback to log account and profile information during the sign-in process.
     * This function returns true to proceed with the sign-in or false to block it.
     *
     * @param {object} account - Account information provided by the OAuth provider.
     * @param {object} profile - Profile information from the OAuth provider.
     * @returns {boolean} - Whether the sign-in is allowed.
     */
    async signIn({ account, profile }) {
      try {
        console.log("Sign-in attempt");
        if (process.env.NODE_ENV !== "production") {
          console.debug("Account: ", account);
          console.debug("Profile: ", profile);
        }
        return true;
      } catch (error) {
        console.error("Error during sign-in: ", error);
        return false;
      }
    },
  },
};
