import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import Student from "@/models/Student";
import { RecentActivityItem } from "@/types/dashboard";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const logger = new Logger("API <<==>> Dashboard Activity");

interface StudentActivityDoc {
  _id: string;
  firstName: string;
  lastName: string;
  status: string;
  currentClassName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get date for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch recent onboarded students
    const recentOnboarded = await Student.find({
      status: "onboarded",
      updatedAt: { $gte: sevenDaysAgo },
    })
      .select("firstName lastName updatedAt currentClassName")
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean<StudentActivityDoc[]>();

    // Fetch recently created students (imports/additions)
    const recentCreated = await Student.find({
      createdAt: { $gte: sevenDaysAgo },
    })
      .select("firstName lastName createdAt status")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean<StudentActivityDoc[]>();

    // Build activity list
    const activities: RecentActivityItem[] = [];

    // Add onboarding completions
    recentOnboarded.forEach((student) => {
      activities.push({
        id: `onboard-${student._id}`,
        type: "onboarding_complete",
        timestamp: student.updatedAt.toISOString(),
        metadata: {
          studentName: `${student.firstName} ${student.lastName}`,
          className: student.currentClassName,
        },
      });
    });

    // Add student additions (only if not already onboarded in same timeframe)
    const onboardedIds = new Set(recentOnboarded.map((s) => s._id.toString()));
    recentCreated.forEach((student) => {
      // Skip if this student is already in onboarded list
      if (onboardedIds.has(student._id.toString())) return;

      activities.push({
        id: `created-${student._id}`,
        type: "student_added",
        timestamp: student.createdAt.toISOString(),
        metadata: {
          studentName: `${student.firstName} ${student.lastName}`,
        },
      });
    });

    // Sort by timestamp descending and limit to 15
    activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    const limitedActivities = activities.slice(0, 15);

    return NextResponse.json(
      { activities: limitedActivities },
      { status: 200 },
    );
  } catch (error) {
    logger.error(
      "Failed to retrieve dashboard activity",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
