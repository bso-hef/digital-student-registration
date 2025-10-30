import NextAuth from "next-auth";

import { authEdgeConfig } from "@/lib/auth/auth.edge.config";

// Initialize NextAuth with edge-safe config for middleware
const { auth } = NextAuth(authEdgeConfig);

// Middleware runs in Edge Runtime and cannot use Node.js APIs like mongoose
// Setup check is handled in the setup page itself (Server Component with Node.js runtime)
export default auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes - handled by NextAuth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
