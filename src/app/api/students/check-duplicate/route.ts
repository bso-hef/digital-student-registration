import { dbConnect } from "@/lib/config/mongo";
import { norm } from "@/lib/config/norm";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import Logger from "@/lib/server-logger";
import Student from "@/models/Student";
import { parseDate } from "@/utils/date.utils";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Students Check Duplicate");

// This endpoint is public (no auth) and is an existence oracle, so throttle it
// per IP to slow down enumeration.
const RATE_LIMIT = 20;
const RATE_WINDOW_SECONDS = 60;

/**
 * Calculate days between two dates
 */
const daysBetween = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * GET /api/students/check-duplicate
 * Query params: firstName, lastName, dateOfBirth
 * Public (unauthenticated). Returns only the minimum the warning UI needs:
 * { exists: boolean, isRecentDuplicate: boolean, daysSinceUpdate?: number }.
 * Never returns student identity, record id, or status (see PII note below).
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(
      `students:check-duplicate:${ip}`,
      RATE_LIMIT,
      RATE_WINDOW_SECONDS,
    );
    if (!limit.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const dateOfBirth = searchParams.get("dateOfBirth");

    // Validate required parameters
    if (!firstName || !lastName || !dateOfBirth) {
      return NextResponse.json(
        {
          message:
            "Missing required parameters: firstName, lastName, dateOfBirth",
        },
        { status: 400 },
      );
    }

    // Parse and validate date of birth
    const dob = parseDate(dateOfBirth);
    if (!dob) {
      return NextResponse.json(
        { message: "Invalid dateOfBirth format" },
        { status: 400 },
      );
    }

    // Normalize names for comparison
    const firstNameNorm = norm(firstName.trim());
    const lastNameNorm = norm(lastName.trim());

    // Query for existing students with same normalized names and DOB.
    // This endpoint is public (no auth), so we only read the timestamp needed
    // to decide recency — never the student's identity/status. See the trimmed
    // response below.
    const existingStudent = await Student.findOne({
      firstNameNorm,
      lastNameNorm,
      dateOfBirth: dob,
    })
      .select("_id updatedAt")
      .lean<{
        _id: unknown;
        updatedAt: Date;
      }>();

    if (!existingStudent) {
      // No duplicate found
      return NextResponse.json(
        {
          exists: false,
          isRecentDuplicate: false,
        },
        { status: 200 },
      );
    }

    // Check if the duplicate was recently updated (within 7 days)
    const now = new Date();
    const daysSinceUpdate = daysBetween(
      new Date(existingStudent.updatedAt),
      now,
    );
    const isRecentDuplicate = daysSinceUpdate < 7;

    logger.info(
      `Duplicate check: Found existing student (ID: ${existingStudent._id}), updated ${daysSinceUpdate} days ago`,
    );

    // Public endpoint: return only the minimum the warning UI needs.
    // Do NOT echo back the student's identity, record id, or status — the
    // caller already knows the name/DOB they typed, and exposing existence +
    // status to anonymous callers is a PII-enumeration risk (see SECURITY.md).
    return NextResponse.json(
      {
        exists: true,
        isRecentDuplicate,
        daysSinceUpdate,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error(
      "Failed to check for duplicate students",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
