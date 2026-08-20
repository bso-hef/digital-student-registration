import { auth, generateRecoveryCode } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import User from "@/models/User";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Admins");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isStrongPassword = (password: unknown): password is string =>
  typeof password === "string" &&
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password);

const serializeAdmin = (
  user: Record<string, unknown>,
  currentUserId: string,
) => ({
  id: String(user._id),
  email: user.email,
  firstName: user.firstName || "",
  lastName: user.lastName || "",
  active: user.active,
  lastLogin: user.lastLogin || null,
  createdAt: user.createdAt,
  isCurrentUser: String(user._id) === currentUserId,
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const admins = await User.find({ role: "admin", isSetup: true })
      .select("email firstName lastName active lastLogin createdAt")
      .sort({ lastName: 1, firstName: 1, email: 1 })
      .lean();
    return NextResponse.json({
      success: true,
      data: admins.map((admin) => serializeAdmin(admin, session.user.id)),
    });
  } catch (error) {
    logger.error("Failed to list admins", error);
    return NextResponse.json(
      { success: false, error: "Failed to list admins" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName =
      typeof body.lastName === "string" ? body.lastName.trim() : "";

    if (
      !EMAIL_REGEX.test(email) ||
      firstName.length > 100 ||
      lastName.length > 100
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid admin data" },
        { status: 400 },
      );
    }
    if (!isStrongPassword(body.password)) {
      return NextResponse.json(
        { success: false, error: "Password does not meet the requirements" },
        { status: 400 },
      );
    }

    await dbConnect();
    if (await User.exists({ email })) {
      return NextResponse.json(
        { success: false, error: "Email is already in use" },
        { status: 409 },
      );
    }

    const recoveryCode = generateRecoveryCode();
    const admin = await User.create({
      email,
      password: body.password,
      recoveryCode,
      firstName,
      lastName,
      role: "admin",
      active: body.active !== false,
      isSetup: true,
    });

    await createAuditLog(
      {
        action: "auth.admin_create",
        category: "auth",
        description: `Admin account created: ${email}`,
        status: "success",
        userId: session.user.id,
        userEmail: session.user.email,
        metadata: { adminId: admin._id.toString(), email },
      },
      request,
    );

    return NextResponse.json(
      {
        success: true,
        data: serializeAdmin(admin.toObject(), session.user.id),
        recoveryCode,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed to create admin", error);
    return NextResponse.json(
      { success: false, error: "Failed to create admin" },
      { status: 500 },
    );
  }
}
