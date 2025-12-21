import { dbConnect } from "@/lib/config/mongo";
import User from "@/models/User";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();

          // Find user by email
          const user = await User.findOne({
            email: (credentials.email as string).toLowerCase(),
            active: true,
          });

          if (!user) {
            return null;
          }

          // Verify password using the model method
          const isPasswordValid = await user.verifyPassword(
            credentials.password as string,
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last login timestamp
          user.lastLogin = new Date();
          await user.save();

          // Return user data (will be stored in JWT)
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
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
    async signIn() {
      // You can add additional sign-in logic here
      // For example, logging to audit log (we'll add this later)
      return true;
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
