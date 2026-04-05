// src/lib/getServerSession.js
import { getServerSession as nextAuthGetServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * Use this in getServerSideProps on any protected page.
 *
 * Usage:
 *   const session = await getServerSession(req, res)
 *   if (!session) return redirectToSignIn()
 *
 * Returns the session object if authenticated, null if not.
 */
export async function getServerSession(req, res) {
  return await nextAuthGetServerSession(req, res, authOptions);
}

/**
 * Standard redirect object to send unauthenticated users to sign-in.
 * Pass the current path as callbackUrl so they return after signing in.
 *
 * Usage:
 *   return redirectToSignIn("/portfolio")
 */
export function redirectToSignIn(callbackUrl = "/") {
  return {
    redirect: {
      destination: `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      permanent: false,
    },
  };
}