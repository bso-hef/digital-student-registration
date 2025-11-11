import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import AuditLog from "@/models/AuditLog";
import { NextRequest, NextResponse } from "next/server";

const logger = new Logger("AuditLogDeleteAPI");

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs array is required" },
        { status: 400 },
      );
    }

    // Delete the audit logs with the specified IDs
    const result = await AuditLog.deleteMany({ _id: { $in: ids } });

    logger.info(`Deleted ${result.deletedCount} audit logs`, { ids });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    logger.error("Error deleting selected audit logs", error);
    return NextResponse.json(
      { error: "Failed to delete selected audit logs" },
      { status: 500 },
    );
  }
}
