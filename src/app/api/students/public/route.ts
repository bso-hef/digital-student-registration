import { dbConnect } from "@/lib/config/mongo";
import { norm } from "@/lib/config/norm";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { tServer } from "@/lib/server-i18n";
import Logger from "@/lib/server-logger";
import Student from "@/models/Student";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import { parseDate } from "@/utils/date.utils";
import { isValidBirthDate, isValidStudentName } from "@/utils/validation.utils";
import { generateUniqueVerificationCode } from "@/utils/verification.utils";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Students Public");

// Max requests per IP per window (write endpoint → deliberately tight).
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 60;

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
 * Every other student endpoint stays auth-protected. Throttled per IP.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(
      `students:public:${ip}`,
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

    const body = await request.json();
    const input: PublicStudentInput = body?.student ?? {};

    const firstName =
      typeof input.firstName === "string" ? input.firstName.trim() : "";
    const lastName =
      typeof input.lastName === "string" ? input.lastName.trim() : "";
    const dateOfBirth = parseDate(input.dateOfBirth);

    if (
      !isValidStudentName(firstName) ||
      !isValidStudentName(lastName) ||
      !dateOfBirth
    ) {
      return NextResponse.json(
        {
          message:
            "Missing or invalid fields: firstName, lastName, dateOfBirth",
        },
        { status: 400 },
      );
    }

    if (!isValidBirthDate(dateOfBirth)) {
      return NextResponse.json(
        { message: "Invalid dateOfBirth" },
        { status: 400 },
      );
    }

    // Create with a unique verification code, retrying on the rare race where
    // two concurrent requests generate the same code (caught via the unique
    // index's duplicate-key error) instead of surfacing a generic 500.
    const maxAttempts = 5;
    let student = null;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
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

      try {
        student = await Student.create({
          firstName,
          lastName,
          dateOfBirth,
          firstNameNorm: norm(firstName),
          lastNameNorm: norm(lastName),
          status: "imported",
          verificationCode,
        });
        break;
      } catch (error) {
        const isDuplicateCode =
          typeof error === "object" &&
          error !== null &&
          (error as { code?: number }).code === 11000;
        if (isDuplicateCode && attempt < maxAttempts - 1) {
          continue;
        }
        throw error;
      }
    }

    if (!student) {
      throw new Error("Failed to allocate a unique verification code");
    }

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

    // Return only the id the client needs to redirect into onboarding — never
    // echo the full record (verificationCode, norm fields, status, timestamps)
    // to an anonymous caller. Mirrors the PII discipline in check-duplicate.
    return NextResponse.json(
      { created: [{ _id: student._id }], createdCount: 1 },
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
