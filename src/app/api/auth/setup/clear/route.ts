import { SETUP_COOKIE_NAME } from "@/lib/auth/setupCookie";
import { serverConfig } from "@/lib/config/app-config";
import { NextRequest, NextResponse } from "next/server";

/**
 * Clear setup cookie endpoint
 * Useful for testing or when database is reset
 *
 * Usage:
 * - GET /api/auth/setup/clear - Returns JSON
 * - GET /api/auth/setup/clear?redirect=/setup - Clears cookie and redirects
 */
export async function GET(req: NextRequest) {
  try {
    // Check if redirect parameter is provided
    const { searchParams } = new URL(req.url);
    const redirectUrl = searchParams.get("redirect");

    // Create response (either redirect or JSON)
    // Use NEXTAUTH_URL (runtime variable) for correct redirect in Docker deployments
    const response = redirectUrl
      ? NextResponse.redirect(new URL(redirectUrl, serverConfig.nextAuth.url))
      : NextResponse.json(
          {
            success: true,
            message: "Setup cookie cleared successfully",
          },
          { status: 200 },
        );

    // Clear the cookie by setting it with maxAge: 0
    response.cookies.set(SETUP_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // This deletes the cookie
    });

    return response;
  } catch (error) {
    console.error("Setup cookie clear error:", error);
    return NextResponse.json(
      {
        error: "Failed to clear setup cookie",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
