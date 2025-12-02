import { auth } from "@/lib/auth/auth";
import { recalculateStudentCounts } from "@/server/jobs/recalculateStudentCounts";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/classes/recalculate-counts
 * Recalculates studentCount for all classes based on actual student assignments
 */
export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const result = await recalculateStudentCounts();

  return NextResponse.json({
    message: "Student counts recalculated",
    ...result,
  });
}
