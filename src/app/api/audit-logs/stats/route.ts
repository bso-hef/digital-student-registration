import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import AuditLog from "@/models/AuditLog";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> AuditLogsStats");

/**
 * GET /api/audit-logs/stats
 * Get statistics about audit logs
 */
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get total count
    const total = await AuditLog.countDocuments();

    // Get counts by category
    const byCategory = await AuditLog.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get counts by action
    const byAction = await AuditLog.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 }, // Top 20 actions
    ]);

    // Get counts by status
    const byStatus = await AuditLog.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await AuditLog.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top users
    const topUsers = await AuditLog.aggregate([
      {
        $group: {
          _id: "$userName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 }, // Top 10 users
    ]);

    // Convert aggregation results to objects
    const byCategoryObj: Record<string, number> = {};
    byCategory.forEach((item) => {
      byCategoryObj[item._id] = item.count;
    });

    const byActionObj: Record<string, number> = {};
    byAction.forEach((item) => {
      byActionObj[item._id] = item.count;
    });

    const byStatusObj: Record<string, number> = {};
    byStatus.forEach((item) => {
      byStatusObj[item._id] = item.count;
    });

    const recentActivityObj: Record<string, number> = {};
    recentActivity.forEach((item) => {
      recentActivityObj[item._id] = item.count;
    });

    const topUsersObj: Record<string, number> = {};
    topUsers.forEach((item) => {
      topUsersObj[item._id] = item.count;
    });

    logger.info("Fetched audit log statistics", { total });

    return NextResponse.json(
      {
        success: true,
        stats: {
          total,
          byCategory: byCategoryObj,
          byAction: byActionObj,
          byStatus: byStatusObj,
          recentActivity: recentActivityObj,
          topUsers: topUsersObj,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to fetch audit log statistics", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch audit log statistics",
      },
      { status: 500 },
    );
  }
}
