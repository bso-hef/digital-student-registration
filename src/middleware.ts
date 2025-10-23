import { NextRequest, NextResponse } from "next/server";

// import { verifyToken } from "./src/lib/auth";
// TODO: Create good flow for middleware

const PUBLIC_PATHS = [
  "/",
  "/api/auth/register",
  "/favicon.ico",
  "/_next/",
  "/static/",
];

function isPublic(path: string) {
  return PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(publicPath),
  );
}

// **Als default** exportieren**
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Alle Pfade, ausgenommen _next, static, favicon und /api/auth
    "/((?!_next|static|favicon.ico|api/auth).*)",
  ],
};
