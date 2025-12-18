import { authEdgeConfig } from "@/lib/auth/auth.edge.config";
import { getSetupCookieValue } from "@/lib/auth/setupCookie";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

// Initialize NextAuth with edge-safe config for middleware
const { auth } = NextAuth(authEdgeConfig);

// Wrap NextAuth's auth middleware with our custom logic
export default auth((req) => {
  // Check if system setup is complete via cookie
  const isSetupComplete = getSetupCookieValue(req.cookies);
  const { pathname } = req.nextUrl;

  // Get the base URL from environment or construct from request
  // Use NEXT_PUBLIC_APP_URL to ensure consistent redirects with configured port
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;

  // If setup is NOT complete
  if (!isSetupComplete) {
    // Allow access to setup page
    if (pathname === "/setup") {
      return NextResponse.next();
    }
    // Redirect all other routes to setup using configured app URL
    return NextResponse.redirect(new URL("/setup", baseUrl));
  }

  // If setup IS complete and user tries to access setup page
  if (isSetupComplete && pathname === "/setup") {
    // Redirect to login page using configured app URL
    return NextResponse.redirect(new URL("/login", baseUrl));
  }

  // For all other routes, NextAuth middleware handles authentication checks
  // NextAuth will handle:
  // - Protecting /admin/* routes (redirect to /login if not authenticated)
  // - Redirecting authenticated users from /login to /admin/dashboard
  // - Allowing public access to /, /student/*, etc.
  // (handled by the authorized callback in authEdgeConfig)
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (ALL API routes - they handle their own logic)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.webmanifest (PWA manifest)
     * - robots.txt (SEO)
     * - sitemap.xml (SEO)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml).*)",
  ],
};
