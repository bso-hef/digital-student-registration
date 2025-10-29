import { dbConnect } from "@/lib/config/mongo";
import { tServer } from "@/lib/server-i18n";
import Logger from "@/lib/server-logger";
import AuditLog from "@/models/AuditLog";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import { NextRequest, NextResponse } from "next/server";

import AppSettings from "@/models/AppSettings";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> AuditLogs");

/**
 * GET /api/audit-logs
 * Fetch audit logs with pagination and filters
 * Query params: page, limit, category, action, status, startDate, endDate, search
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      200,
      Math.max(1, Number(searchParams.get("limit") || 25)),
    );
    const skip = (page - 1) * limit;

    // Build filter query
    const filter: Record<string, unknown> = {};

    const category = searchParams.get("category");
    if (category) {
      filter.category = category;
    }

    const action = searchParams.get("action");
    if (action) {
      filter.action = action;
    }

    const status = searchParams.get("status");
    if (status) {
      filter.status = status;
    }

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        (filter.timestamp as Record<string, unknown>).$gte = new Date(
          startDate,
        );
      }
      if (endDate) {
        (filter.timestamp as Record<string, unknown>).$lte = new Date(endDate);
      }
    }

    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: "i" } },
        { action: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ timestamp: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    const pages = Math.ceil(total / limit);

    logger.info(`Fetched ${logs.length} audit logs`, { page, limit, total });

    return NextResponse.json(
      {
        success: true,
        logs,
        page,
        limit,
        total,
        pages,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to fetch audit logs", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch audit logs",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/audit-logs
 * Create a new audit log entry (internal use)
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { action, category, description, status, metadata } = body;

    if (!action || !category || !description || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    await createAuditLog(
      {
        action,
        category,
        description,
        status,
        metadata,
      },
      request,
    );

    logger.info("Audit log created via API", { action, category });

    return NextResponse.json(
      { success: true, message: "Audit log created" },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed to create audit log", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create audit log",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/audit-logs
 * Clear old audit logs (respects retention period)
 */
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    // Get retention period from settings
    const settings = await AppSettings.findOne().lean();
    const retentionDays = settings?.audit?.retentionPeriodDays || 90;

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Delete logs older than retention period
    const result = await AuditLog.deleteMany({
      timestamp: { $lt: cutoffDate },
    });

    logger.info(`Cleared ${result.deletedCount} audit logs`, {
      retentionDays,
      cutoffDate,
    });

    // Log the deletion itself
    await createAuditLog(
      {
        action: "system.clear_audit_logs",
        category: "system",
        description: tServer("audit.descriptions.clearedAuditLogs", {
          count: result.deletedCount,
        }),
        status: "success",
        metadata: {
          deletedCount: result.deletedCount,
          retentionDays,
          cutoffDate: cutoffDate.toISOString(),
        },
      },
      request,
    );

    return NextResponse.json(
      {
        success: true,
        deletedCount: result.deletedCount,
        message: `Cleared ${result.deletedCount} audit log(s) older than ${retentionDays} days`,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to clear audit logs", error);

    // Log the failure
    await createAuditLog(
      {
        action: "system.clear_audit_logs",
        category: "system",
        description: tServer("audit.descriptions.failedClearAuditLogs"),
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
        error:
          error instanceof Error ? error.message : "Failed to clear audit logs",
      },
      { status: 500 },
    );
  }
}
