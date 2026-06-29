import { dbConnect } from "@/lib/config/mongo";
import { norm } from "@/lib/config/norm";
import { tServer } from "@/lib/server-i18n";
import Logger from "@/lib/server-logger";
import Student from "@/models/Student";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import { parseDate } from "@/utils/date.utils";
import { generateUniqueVerificationCode } from "@/utils/verification.utils";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Students Public");

interface PublicStudentInput {
  firstName?: unknown;
  lastName?: unknown;
  dateOfBirth?: unknown;
}

/**
 * POST /api/students/public
 *
 * Unauthenticated, self-service student creation used by the public onboarding
 * entry (`/student` → "Neues Schülerprofil erstellen"). Deliberately accepts
 * ONLY the three identity fields and ignores everything else, so an anonymous
 * caller can never set internal fields (status, class assignment, codes, …).
 * Every other student endpoint stays auth-protected.
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const input: PublicStudentInput = body?.student ?? {};

    const firstName =
      typeof input.firstName === "string" ? input.firstName.trim() : "";
    const lastName =
      typeof input.lastName === "string" ? input.lastName.trim() : "";
    const dateOfBirth = parseDate(input.dateOfBirth);

    if (!firstName || !lastName || !dateOfBirth) {
      return NextResponse.json(
        {
          message: "Missing required fields: firstName, lastName, dateOfBirth",
        },
        { status: 400 },
      );
    }

    const verificationCode = await generateUniqueVerificationCode(
      async (code: string) => {
        const count = await Student.countDocuments({
          $and: [
            { verificationCode: { $eq: code } },
            { verificationCode: { $ne: null } },
          ],
        });
        return count > 0;
      },
      100,
    );

    const student = await Student.create({
      firstName,
      lastName,
      dateOfBirth,
      firstNameNorm: norm(firstName),
      lastNameNorm: norm(lastName),
      status: "imported",
      verificationCode,
    });

    await createAuditLog(
      {
        action: "student.create",
        category: "student",
        description: tServer("audit.descriptions.createdStudents", {
          count: 1,
        }),
        status: "success",
        metadata: {
          studentIds: [student._id.toString()],
          studentNames: [`${student.firstName} ${student.lastName}`],
          affectedCount: 1,
          source: "public-self-registration",
        },
      },
      request,
    );

    return NextResponse.json(
      { created: [student], createdCount: 1 },
      { status: 201 },
    );
  } catch (error) {
    logger.error(
      "Failed to create public student",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
