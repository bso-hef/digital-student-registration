import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session user type
   */
  interface User {
    id: string;
    email: string;
    role: string;
  }

  /**
   * Extends the built-in session type
   */
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT token type
   */
  interface JWT {
    id: string;
    email: string;
    role: string;
  }
}
