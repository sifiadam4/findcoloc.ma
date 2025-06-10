import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // console.log("[middleware] Token:", token);
  // console.log("[middleware] Pathname:", pathname);
  console.log(
    "[middleware] Debug - Pathname:",
    pathname,
    "Token exists:",
    !!token
  );
  // Define route categories
  const adminRoutes = ["/admin", "/users", "/annonces"];
  const publicRoutes = ["/", "/api"];
  const authRoutes = ["/sign-in"];
  const protectedRoutes = [
    "/mes-favoris",
    "/mes-candidatures",
    "/mes-sejours",
    "/profile",
    "/dashboard",
    "/mes-offres",
    "/mes-demandes",
  ];

  // Check if current path is in specific route category
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute =
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/colocation/");
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isOnboardingRoute = pathname === "/onboarding"; // If user is not authenticated
  if (!token) {
    console.log("[middleware] No token - checking routes for:", pathname);
    console.log(
      "[middleware] isProtectedRoute:",
      isProtectedRoute,
      "isAdminRoute:",
      isAdminRoute
    );
    console.log(
      "[middleware] isPublicRoute:",
      isPublicRoute,
      "isAuthRoute:",
      isAuthRoute
    );

    // Redirect to sign-in for protected routes with callback URL
    if (isProtectedRoute || isAdminRoute || (!isPublicRoute && !isAuthRoute)) {
      const callbackUrl = encodeURIComponent(pathname + nextUrl.search);
      console.log(
        "[middleware] Redirecting to sign-in with callbackUrl:",
        callbackUrl
      );
      return NextResponse.redirect(
        new URL(`/sign-in?callbackUrl=${callbackUrl}`, req.url)
      );
    }
    return NextResponse.next();
  }

  // User is authenticated
  const { isAdmin, isProfileComplete } = token;
  // If authenticated user tries to access sign-in, redirect them
  if (isAuthRoute) {
    // Check if there's a callback URL to redirect to
    const callbackUrl = nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl) {
      return NextResponse.redirect(
        new URL(decodeURIComponent(callbackUrl), req.url)
      );
    }

    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Handle onboarding logic
  if (!isProfileComplete && !isOnboardingRoute) {
    // User has incomplete profile and trying to access protected routes
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (isProfileComplete && isOnboardingRoute) {
    // User with complete profile trying to access onboarding
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Handle admin routes
  if (isAdminRoute && !isAdmin) {
    // Non-admin trying to access admin routes
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  // After successful sign-in, redirect admin users to admin panel
  if (isAdmin && pathname === "/" && isProfileComplete) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
