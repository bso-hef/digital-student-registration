import { dbConnect } from "@/lib/config/mongo";
import { norm } from "@/lib/config/norm";
import Logger from "@/lib/server-logger";
import Student from "@/models/Student";
import { parseDate } from "@/utils/date.utils";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Students Check Duplicate");

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
 * Returns: { exists: boolean, student?: {...}, isRecentDuplicate: boolean }
 */
export async function GET(request: NextRequest) {
  try {
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

    // Query for existing students with same normalized names and DOB
    const existingStudent = await Student.findOne({
      firstNameNorm,
      lastNameNorm,
      dateOfBirth: dob,
    })
      .select("_id firstName lastName dateOfBirth updatedAt status")
      .lean<{
        _id: unknown;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        updatedAt: Date;
        status: string;
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

    return NextResponse.json(
      {
        exists: true,
        student: {
          id: existingStudent._id,
          firstName: existingStudent.firstName,
          lastName: existingStudent.lastName,
          dateOfBirth: existingStudent.dateOfBirth,
          updatedAt: existingStudent.updatedAt,
          status: existingStudent.status,
        },
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
