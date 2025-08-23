import { NextRequest, NextResponse } from "next/server";

// import { verifyToken } from "./src/lib/auth";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/api/auth/login",
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

  const token =
    req.cookies.get("jwt")?.value ||
    req.headers.get("authorization")?.replace(/^Bearer\s/, "");

  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  try {
    // verifyToken(token);
    return NextResponse.next();
  } catch (_e) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    // Alle Pfade, ausgenommen _next, static, favicon und /api/auth
    "/((?!_next|static|favicon.ico|api/auth).*)",
  ],
};
