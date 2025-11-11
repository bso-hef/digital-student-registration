import { isSystemSetup } from "@/lib/auth/auth";
import { SETUP_COOKIE_NAME } from "@/lib/auth/setupCookie";
import { NextRequest, NextResponse } from "next/server";

/**
 * Sync endpoint to set the setup cookie based on database state
 * This is useful for systems that were set up before the cookie feature was added
 *
 * Usage:
 * - GET /api/auth/setup/sync - Returns JSON with sync status
 * - GET /api/auth/setup/sync?redirect=/login - Sets cookie and redirects
 */
export async function GET(req: NextRequest) {
  try {
    // Check if setup is complete in database
    const setupComplete = await isSystemSetup();

    if (setupComplete) {
      // Check if redirect parameter is provided
      const { searchParams } = new URL(req.url);
      const redirectUrl = searchParams.get("redirect");

      // Create response (either redirect or JSON)
      const response = redirectUrl
        ? NextResponse.redirect(new URL(redirectUrl, req.url))
        : NextResponse.json(
            {
              success: true,
              message: "Setup cookie synced successfully",
              setupComplete: true,
            },
            { status: 200 },
          );

      // Set the cookie on the response object
      response.cookies.set(SETUP_COOKIE_NAME, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });

      return response;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Setup not complete yet",
        setupComplete: false,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Setup sync error:", error);
    return NextResponse.json(
      {
        error: "Failed to sync setup state",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
