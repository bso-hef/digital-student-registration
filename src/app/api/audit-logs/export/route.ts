import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import AuditLog from "@/models/AuditLog";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> AuditLogsExport");

/**
 * Convert audit logs to CSV format
 */
function generateCSV(logs: Array<Record<string, unknown>>): string {
  const headers = [
    "Timestamp",
    "Category",
    "Action",
    "Description",
    "User",
    "Status",
    "IP Address",
    "Metadata",
  ];

  const rows = logs.map((log) => [
    dayjs(log.timestamp as Date).format("YYYY-MM-DD HH:mm:ss"),
    log.category,
    log.action,
    (log.description as string).replace(/"/g, '""'), // Escape quotes
    log.userName,
    log.status,
    log.ipAddress,
    JSON.stringify(log.metadata).replace(/"/g, '""'), // Escape quotes
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * GET /api/audit-logs/export?format=csv|json&filters=...
 * Export audit logs as CSV or JSON
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";

    // Build filter query (same as main route)
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

    // Check if specific IDs are requested (for export selected)
    const ids = searchParams.get("ids");
    if (ids) {
      const idArray = ids.split(",").filter(Boolean);
      filter._id = { $in: idArray };
    }

    // Fetch all matching logs (limited to 10,000 for performance)
    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(10000)
      .lean();

    logger.info(`Exporting ${logs.length} audit logs as ${format}`);

    if (format === "json") {
      const filename = `audit-logs-${dayjs().format("YYYY-MM-DD-HHmmss")}.json`;

      return new NextResponse(JSON.stringify(logs, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } else if (format === "csv") {
      const csvContent = generateCSV(logs);
      const filename = `audit-logs-${dayjs().format("YYYY-MM-DD-HHmmss")}.csv`;

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid format. Use 'csv' or 'json'" },
        { status: 400 },
      );
    }
  } catch (error) {
    logger.error("Failed to export audit logs", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to export audit logs",
      },
      { status: 500 },
    );
  }
}
