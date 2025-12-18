import type { NextAuthConfig } from "next-auth";

// Edge-safe configuration (no database imports)
// This is used by middleware which runs in Edge Runtime
export const authEdgeConfig = {
  providers: [], // Providers are defined in auth.config.ts for the main auth instance
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Protect admin routes - require authentication
      if (pathname.startsWith("/admin")) {
        if (isLoggedIn) return true;
        return false; // NextAuth will redirect to /login
      }

      // Redirect logged-in users away from login page to dashboard
      // (They're already authenticated, no need to log in again)
      if (pathname === "/login" && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl));
      }

      // Allow public access to all other routes:
      // - / (home page)
      // - /student/* (student onboarding)
      // - /reset-password (password reset)
      // Note: /setup is handled by middleware
      return true;
    },
    async jwt({ token, user }) {
      // Add user info to JWT on sign in
      if (user && "role" in user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user info to session from JWT
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // Use secure cookies only when app URL uses HTTPS
        // This allows HTTP in Docker deployment while keeping HTTPS secure
        secure:
          process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ?? false,
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
} satisfies NextAuthConfig;
