import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import { tServer } from "@/lib/server-i18n";
import Logger from "@/lib/server-logger";
import User from "@/models/User";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Profile Password");

/**
 * POST /api/auth/profile/password
 * Changes the current user's password
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Current password and new password are required",
        },
        { status: 400 },
      );
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters long",
        },
        { status: 400 },
      );
    }

    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must contain at least one uppercase letter",
        },
        { status: 400 },
      );
    }

    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must contain at least one lowercase letter",
        },
        { status: 400 },
      );
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { success: false, error: "Password must contain at least one number" },
        { status: 400 },
      );
    }

    // Find user
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.verifyPassword(currentPassword);

    if (!isCurrentPasswordValid) {
      await createAuditLog(
        {
          action: "auth.password_change",
          category: "auth",
          description: tServer("audit.descriptions.failedPasswordChange"),
          status: "failure",
          metadata: {
            userId: session.user.id,
            reason: "Invalid current password",
          },
        },
        request,
      );

      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    // Log audit entry
    await createAuditLog(
      {
        action: "auth.password_change",
        category: "auth",
        description: tServer("audit.descriptions.changedPassword"),
        status: "success",
        metadata: {
          userId: session.user.id,
        },
      },
      request,
    );

    logger.info("Password changed successfully");

    return NextResponse.json(
      {
        success: true,
        message: "Password changed successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to change password", error);

    await createAuditLog(
      {
        action: "auth.password_change",
        category: "auth",
        description: tServer("audit.descriptions.failedPasswordChange"),
        status: "failure",
        metadata: {
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      },
      request,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to change password",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
