// src/proxy.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// ✅ v16 requires the function to be named "proxy" not "middleware"
export async function proxy(req) {
  const { pathname } = req.nextUrl;

  let token = null;

  try {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
  } catch (err) {
    console.error("getToken error:", err);
    token = null;
  }

  const isAuth      = !!token;
  const isAuthPage  = pathname.startsWith("/auth");
  const isProtected =
    pathname.startsWith("/portfolio")  ||
    pathname.startsWith("/settings")   ||
    pathname.startsWith("/api/trades") ||
    pathname.startsWith("/api/user");

  // Already signed in — bounce away from auth pages
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL("/portfolio", req.url));
  }

  // Not signed in — bounce to sign in
  if (!isAuth && isProtected) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // ✅ Every code path must return a Response — never fall through
  return NextResponse.next();
}

// ✅ Also export as default — some Next.js v16 builds require both
export default proxy;

export const config = {
  matcher: [
    "/portfolio/:path*",
    "/settings/:path*",
     "/profile/:path*",
    "/api/trades/:path*",
    "/api/user/:path*",
    "/auth/:path*",
  ],
};