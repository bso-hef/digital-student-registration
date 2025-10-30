import { dbConnect } from "@/lib/config/mongo";
import AppSettings from "@/models/AppSettings";
import NextAuth from "next-auth";

import { authConfig } from "./auth.config";

// Initialize NextAuth with configuration
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

/**
 * Generate a secure 16-character alphanumeric recovery code
 * Format: XXXX-XXXX-XXXX-XXXX (for readability)
 */
export function generateRecoveryCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  // Generate 16 random characters
  for (let i = 0; i < 16; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));

    // Add hyphen every 4 characters for readability (except at the end)
    if ((i + 1) % 4 === 0 && i !== 15) {
      code += "-";
    }
  }

  return code;
}

/**
 * Check if system setup is complete
 * Returns true if an admin user has been created and setup wizard completed
 */
export async function isSystemSetup(): Promise<boolean> {
  try {
    await dbConnect();

    // Check if AppSettings document exists and isSystemSetup is true
    const settings = await AppSettings.findOne();

    if (!settings) {
      return false;
    }

    return settings.isSystemSetup === true;
  } catch (error) {
    console.error("Error checking system setup status:", error);
    return false;
  }
}
