import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Define routes
  const isOnboardingPage = nextUrl.pathname === "/onboarding";
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isStaticFile =
    nextUrl.pathname.startsWith("/_next") || nextUrl.pathname.includes(".");

  // Skip middleware for API routes and static files
  if (isApiRoute || isStaticFile) {
    return NextResponse.next();
  }

  // If user is not logged in and trying to access protected routes
  if (!isLoggedIn && (isOnboardingPage || isDashboardRoute)) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // For logged-in users, let the client-side handle profile completion checks
  // This avoids Prisma in Edge Runtime issues

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
