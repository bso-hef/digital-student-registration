import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import Class from "@/models/Class";
import Student from "@/models/Student";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const logger = new Logger("API <<==>> Dashboard Stats");

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Calculate date for "last 7 days"
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Parallel queries for better performance
    const [
      totalStudents,
      totalClasses,
      unassignedStudents,
      activeClasses,
      studentsByStatus,
      classesByGrade,
      recentStudents,
    ] = await Promise.all([
      // Total students count
      Student.countDocuments({}),

      // Total classes count
      Class.countDocuments({}),

      // Unassigned students (no current class)
      Student.countDocuments({ currentClass: null, active: true }),

      // Active classes
      Class.countDocuments({ active: true }),

      // Students grouped by status
      Student.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Classes grouped by grade
      Class.aggregate([
        {
          $match: { active: true },
        },
        {
          $group: {
            _id: "$grade",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),

      // Recent student registrations (last 7 days) grouped by day
      Student.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),
    ]);

    // Format student status data
    const statusBreakdown = {
      imported: 0,
      invited: 0,
      onboarded: 0,
      other: 0,
    };

    studentsByStatus.forEach((item: { _id: string; count: number }) => {
      const status = item._id?.toLowerCase() || "other";
      if (
        status === "imported" ||
        status === "invited" ||
        status === "onboarded"
      ) {
        statusBreakdown[status] = item.count;
      } else {
        statusBreakdown.other += item.count;
      }
    });

    // Format grade distribution
    const gradeDistribution = classesByGrade.map(
      (item: { _id: number | null; count: number }) => ({
        grade: item._id !== null ? `Grade ${item._id}` : "No Grade",
        count: item.count,
      }),
    );

    // Format recent registrations with all 7 days
    const registrationTrend: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const existingData = recentStudents.find(
        (item: { _id: string; count: number }) => item._id === dateStr,
      );

      registrationTrend.push({
        date: dateStr,
        count: existingData?.count || 0,
      });
    }

    const response = {
      quickStats: {
        totalStudents,
        totalClasses,
        unassignedStudents,
        activeClasses,
      },
      studentStatusBreakdown: statusBreakdown,
      gradeDistribution,
      registrationTrend,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger.error(
      "Failed to retrieve dashboard stats",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
