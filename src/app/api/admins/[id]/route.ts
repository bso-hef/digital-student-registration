import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import User from "@/models/User";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Admin");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validPassword = (value: string) =>
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /[0-9]/.test(value);

async function authorize() {
  const session = await auth();
  return session?.user?.id && session.user.role === "admin" ? session : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await authorize();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 },
      );
    }
    const body = await request.json();
    await dbConnect();
    const admin = await User.findOne({ _id: id, role: "admin", isSetup: true });
    if (!admin)
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 },
      );

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
    if (
      body.password &&
      (typeof body.password !== "string" || !validPassword(body.password))
    ) {
      return NextResponse.json(
        { success: false, error: "Password does not meet the requirements" },
        { status: 400 },
      );
    }
    if (String(admin._id) === session.user.id && body.active === false) {
      return NextResponse.json(
        { success: false, error: "You cannot deactivate your own account" },
        { status: 400 },
      );
    }
    if (await User.exists({ email, _id: { $ne: admin._id } })) {
      return NextResponse.json(
        { success: false, error: "Email is already in use" },
        { status: 409 },
      );
    }

    admin.email = email;
    admin.firstName = firstName;
    admin.lastName = lastName;
    admin.active = body.active !== false;
    if (body.password) admin.password = body.password;
    await admin.save();

    await createAuditLog(
      {
        action: "auth.admin_update",
        category: "auth",
        description: `Admin account updated: ${email}`,
        status: "success",
        userId: session.user.id,
        userEmail: session.user.email,
        metadata: {
          adminId: id,
          email,
          passwordChanged: Boolean(body.password),
        },
      },
      request,
    );

    return NextResponse.json({
      success: true,
      data: {
        id: String(admin._id),
        email: admin.email,
        firstName: admin.firstName || "",
        lastName: admin.lastName || "",
        active: admin.active,
        lastLogin: admin.lastLogin || null,
        createdAt: admin.createdAt,
        isCurrentUser: String(admin._id) === session.user.id,
      },
    });
  } catch (error) {
    logger.error("Failed to update admin", error);
    return NextResponse.json(
      { success: false, error: "Failed to update admin" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await authorize();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    if (id === session.user.id) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own account" },
        { status: 400 },
      );
    }
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 },
      );
    }
    await dbConnect();
    const admin = await User.findOne({ _id: id, role: "admin", isSetup: true });
    if (!admin)
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 },
      );
    if (
      admin.active &&
      (await User.countDocuments({
        role: "admin",
        isSetup: true,
        active: true,
      })) <= 1
    ) {
      return NextResponse.json(
        { success: false, error: "The last active admin cannot be deleted" },
        { status: 400 },
      );
    }
    await admin.deleteOne();
    await createAuditLog(
      {
        action: "auth.admin_delete",
        category: "auth",
        description: `Admin account deleted: ${admin.email}`,
        status: "success",
        userId: session.user.id,
        userEmail: session.user.email,
        metadata: { adminId: id, email: admin.email },
      },
      request,
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete admin", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete admin" },
      { status: 500 },
    );
  }
}
