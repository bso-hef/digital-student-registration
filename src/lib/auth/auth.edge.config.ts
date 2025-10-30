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
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnAuth = ["/login", "/setup", "/reset-password"].includes(
        nextUrl.pathname,
      );

      // Protect admin routes
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect to login page
      }

      // Redirect logged-in users away from auth pages
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl));
      }

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
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
