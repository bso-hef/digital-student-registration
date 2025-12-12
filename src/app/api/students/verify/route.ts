import { dbConnect } from "@/lib/config/mongo";
import { norm } from "@/lib/config/norm";
import Student from "@/models/Student";
import { ClassInterface } from "@/types/class";
import { Student as StudentType } from "@/types/db";
import {
  isValidVerificationCode,
  normalizeVerificationCode,
} from "@/utils/verification.utils";
import { NextRequest, NextResponse } from "next/server";

// Type for student with populated currentClass
type StudentWithClass = Omit<StudentType, "currentClass"> & {
  currentClass: ClassInterface | null;
};

/**
 * POST /api/students/verify
 * Verifies student identity using first name, last name, and verification code
 * Returns student ID if verification successful
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { firstName, lastName, verificationCode } = body;

    // Validate required fields
    if (!firstName || !lastName || !verificationCode) {
      return NextResponse.json(
        {
          error: "Alle Felder sind erforderlich",
          code: "MISSING_FIELDS",
        },
        { status: 400 },
      );
    }

    // Normalize verification code to uppercase
    const normalizedCode = normalizeVerificationCode(verificationCode);

    // Validate verification code format
    if (!isValidVerificationCode(normalizedCode)) {
      return NextResponse.json(
        {
          error:
            "Ungültiges Format. Der Code muss 6 Zeichen (0-9, A-Z) enthalten",
          code: "INVALID_CODE_FORMAT",
        },
        { status: 400 },
      );
    }

    // Find student by verification code
    const student = (await Student.findOne({
      verificationCode: normalizedCode,
      active: true,
    })
      .populate("currentClass")
      .lean()) as StudentWithClass | null;

    if (!student) {
      return NextResponse.json(
        {
          error: "Verifizierungscode nicht gefunden",
          code: "CODE_NOT_FOUND",
        },
        { status: 404 },
      );
    }

    // Normalize names for comparison (case-insensitive, diacritic-insensitive)
    const normalizedInputFirstName = norm(firstName.trim());
    const normalizedInputLastName = norm(lastName.trim());
    const normalizedStudentFirstName = norm(student.firstName);
    const normalizedStudentLastName = norm(student.lastName);

    // Check if names match
    if (
      normalizedInputFirstName !== normalizedStudentFirstName ||
      normalizedInputLastName !== normalizedStudentLastName
    ) {
      return NextResponse.json(
        {
          error: "Name stimmt nicht mit dem Verifizierungscode überein",
          code: "NAME_MISMATCH",
        },
        { status: 403 },
      );
    }

    // Check if student has already completed onboarding
    if (student.status === "onboarded") {
      return NextResponse.json(
        {
          error: "Schüler hat bereits das Onboarding abgeschlossen",
          code: "ALREADY_ONBOARDED",
        },
        { status: 409 },
      );
    }

    // Note: Students can verify and start onboarding without class assignment
    // Class assignment is now optional

    // Verification successful - return student ID
    return NextResponse.json(
      {
        success: true,
        studentId: student._id.toString(),
        message: "Verifizierung erfolgreich",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        error: "Ein Fehler ist bei der Verifizierung aufgetreten",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
