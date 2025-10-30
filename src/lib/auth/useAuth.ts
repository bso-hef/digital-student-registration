import { useSession } from "next-auth/react";

/**
 * Custom hook for authentication
 * Wraps NextAuth's useSession hook for easier access to auth state
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user || null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    session,
  };
}
