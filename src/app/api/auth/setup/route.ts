import { NextRequest, NextResponse } from "next/server";

import { generateRecoveryCode, isSystemSetup } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import AppSettings from "@/models/AppSettings";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Check if setup has already been completed
    const setupCompleted = await isSystemSetup();
    if (setupCompleted) {
      return NextResponse.json(
        { error: "Setup has already been completed" },
        { status: 400 },
      );
    }

    // Parse request body
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter" },
        { status: 400 },
      );
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one lowercase letter" },
        { status: 400 },
      );
    }

    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one number" },
        { status: 400 },
      );
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Generate recovery code (plain text, will be hashed by model)
    const plainRecoveryCode = generateRecoveryCode();

    // Create admin user (password and recoveryCode will be hashed by pre-save hooks)
    const user = await User.create({
      email: email.toLowerCase(),
      password: password, // Will be hashed by pre-save hook
      recoveryCode: plainRecoveryCode, // Will be hashed by pre-save hook
      isSetup: true,
      role: "admin",
      active: true,
    });

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

    // Return success with the plain recovery code
    // IMPORTANT: This is the ONLY time the recovery code is sent in plain text
    return NextResponse.json(
      {
        success: true,
        message: "Admin account created successfully",
        recoveryCode: plainRecoveryCode, // Return plain text recovery code
        email: user.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      {
        error: "Failed to complete setup",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET endpoint to check if setup is complete
export async function GET() {
  try {
    await dbConnect();
    const setupCompleted = await isSystemSetup();

    return NextResponse.json({
      setupCompleted,
    });
  } catch (error) {
    console.error("Error checking setup status:", error);
    return NextResponse.json(
      { error: "Failed to check setup status" },
      { status: 500 },
    );
  }
}
