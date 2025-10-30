import { SETUP_COOKIE_NAME } from "@/lib/auth/setupCookie";
import { dbConnect } from "@/lib/config/mongo";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

import AppSettings from "@/models/AppSettings";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Parse request body
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the admin user
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: "admin",
    });

    if (!user) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 },
      );
    }

    // Mark user as setup complete
    user.isSetup = true;
    await user.save();

    // Update or create AppSettings to mark setup as complete
    let settings = await AppSettings.findOne();
    if (!settings) {
      // Create new settings document if it doesn't exist
      settings = await AppSettings.create({
        isSystemSetup: true,
      });
    } else {
      // Update existing settings
      settings.isSystemSetup = true;
      await settings.save();
    }

    // Create the response
    const response = NextResponse.json(
      {
        success: true,
        message: "Setup completed successfully",
      },
      { status: 200 },
    );

    // Set the setup-complete cookie on the response
    response.cookies.set(SETUP_COOKIE_NAME, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  } catch (error) {
    console.error("Setup completion error:", error);
    return NextResponse.json(
      {
        error: "Failed to complete setup",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
