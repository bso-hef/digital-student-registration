import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import { tServer } from "@/lib/server-i18n";
import Logger from "@/lib/server-logger";
import User from "@/models/User";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Profile");

/**
 * GET /api/auth/profile
 * Fetches the current user's profile
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select(
      "firstName lastName email avatar phone jobTitle timezone",
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    logger.info("Profile fetched successfully");

    return NextResponse.json(
      {
        success: true,
        data: {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email,
          avatar: user.avatar || null,
          phone: user.phone || "",
          jobTitle: user.jobTitle || "",
          timezone: user.timezone || "Europe/Berlin",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to fetch profile", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch profile",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/auth/profile
 * Updates the current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
        },
        { status: 400 },
      );
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const oldValues = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar ? "[avatar data]" : null,
      phone: user.phone,
      jobTitle: user.jobTitle,
      timezone: user.timezone,
    };

    // Update allowed fields only
    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "avatar",
      "phone",
      "jobTitle",
      "timezone",
    ];
    const changedFields: string[] = [];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Validate email format if email is being changed
        if (field === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(body[field])) {
            return NextResponse.json(
              { success: false, error: "Invalid email format" },
              { status: 400 },
            );
          }

          // Check if email is already in use by another user
          const existingUser = await User.findOne({
            email: body[field].toLowerCase(),
            _id: { $ne: session.user.id },
          });

          if (existingUser) {
            return NextResponse.json(
              { success: false, error: "Email is already in use" },
              { status: 400 },
            );
          }
        }

        // Validate firstName/lastName length
        if (
          (field === "firstName" || field === "lastName") &&
          body[field].length > 100
        ) {
          return NextResponse.json(
            {
              success: false,
              error: `${field} must be at most 100 characters`,
            },
            { status: 400 },
          );
        }

        // Validate avatar size (base64 string)
        if (field === "avatar" && body[field]) {
          if (body[field].length > 1400000) {
            return NextResponse.json(
              { success: false, error: "Avatar image size exceeds 1MB limit" },
              { status: 400 },
            );
          }
        }

        // Validate phone length
        if (field === "phone" && body[field] && body[field].length > 30) {
          return NextResponse.json(
            { success: false, error: "Phone must be at most 30 characters" },
            { status: 400 },
          );
        }

        // Validate jobTitle length
        if (field === "jobTitle" && body[field] && body[field].length > 100) {
          return NextResponse.json(
            {
              success: false,
              error: "Job title must be at most 100 characters",
            },
            { status: 400 },
          );
        }

        if (user[field as keyof typeof user] !== body[field]) {
          changedFields.push(field);
        }
        (user as Record<string, unknown>)[field] = body[field];
      }
    }

    if (changedFields.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email,
            avatar: user.avatar || null,
            phone: user.phone || "",
            jobTitle: user.jobTitle || "",
            timezone: user.timezone || "Europe/Berlin",
          },
          message: "No changes detected",
        },
        { status: 200 },
      );
    }

    await user.save();

    // Log audit entry
    await createAuditLog(
      {
        action: "auth.profile_update",
        category: "auth",
        description: tServer("audit.descriptions.updatedProfile"),
        status: "success",
        metadata: {
          userId: session.user.id,
          changedFields,
          oldValues: {
            ...oldValues,
            avatar: oldValues.avatar ? "[avatar data]" : null,
          },
          newValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar ? "[avatar data]" : null,
            phone: user.phone,
            jobTitle: user.jobTitle,
            timezone: user.timezone,
          },
        },
      },
      request,
    );

    logger.info("Profile updated successfully");

    return NextResponse.json(
      {
        success: true,
        data: {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email,
          avatar: user.avatar || null,
          phone: user.phone || "",
          jobTitle: user.jobTitle || "",
          timezone: user.timezone || "Europe/Berlin",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to update profile", error);

    await createAuditLog(
      {
        action: "auth.profile_update",
        category: "auth",
        description: tServer("audit.descriptions.failedUpdateProfile"),
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
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
