import { cookies } from "next/headers";

/**
 * Cookie name for storing system setup state
 */
export const SETUP_COOKIE_NAME = "setup-complete";

/**
 * Cookie options for setup state
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 year
};

/**
 * Sets the setup-complete cookie to indicate system setup is done
 * Called when admin completes the setup process
 */
export async function setSetupCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SETUP_COOKIE_NAME, "true", COOKIE_OPTIONS);
}

/**
 * Clears the setup-complete cookie
 * Used for testing or system reset scenarios
 */
export async function clearSetupCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SETUP_COOKIE_NAME);
}

/**
 * Gets the setup state from cookie
 * Returns true if setup is complete, false otherwise
 * This is used in middleware (Edge Runtime compatible)
 */
export function getSetupCookieValue(cookieStore: {
  get: (name: string) => { value: string } | undefined;
}): boolean {
  const cookie = cookieStore.get(SETUP_COOKIE_NAME);
  return cookie?.value === "true";
}
