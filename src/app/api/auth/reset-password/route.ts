import { NextRequest, NextResponse } from "next/server";

import { dbConnect } from "@/lib/config/mongo";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Parse request body
    const { email, recoveryCode, newPassword } = await req.json();

    // Validate input
    if (!email || !recoveryCode || !newPassword) {
      return NextResponse.json(
        { error: "Email, recovery code, and new password are required" },
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

    // Validate recovery code format
    const recoveryCodeRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!recoveryCodeRegex.test(recoveryCode)) {
      return NextResponse.json(
        { error: "Invalid recovery code format" },
        { status: 400 },
      );
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter" },
        { status: 400 },
      );
    }

    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must contain at least one lowercase letter" },
        { status: 400 },
      );
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must contain at least one number" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      active: true,
    });

    if (!user) {
      // Don't reveal whether the email exists for security reasons
      return NextResponse.json(
        { error: "Invalid email or recovery code" },
        { status: 400 },
      );
    }

    // Verify recovery code using the model method
    const isRecoveryCodeValid = await user.verifyRecoveryCode(recoveryCode);

    if (!isRecoveryCodeValid) {
      return NextResponse.json(
        { error: "Invalid email or recovery code" },
        { status: 400 },
      );
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    // TODO: Log password reset to audit log (will be added later)

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      {
        error: "Failed to reset password",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
