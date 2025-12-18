import { dbConnect } from "@/lib/config/mongo";
import NextAuth from "next-auth";

import AppSettings from "@/models/AppSettings";

import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

export function generateRecoveryCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 16; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));

    if ((i + 1) % 4 === 0 && i !== 15) {
      code += "-";
    }
  }

  return code;
}

export async function isSystemSetup(): Promise<boolean> {
  try {
    await dbConnect();

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
