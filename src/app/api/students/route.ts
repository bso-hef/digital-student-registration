import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import { norm } from "@/lib/config/norm";
import { tServer } from "@/lib/server-i18n";
import Logger from "@/lib/server-logger";
import Class from "@/models/Class";
import Student from "@/models/Student";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import { parseDate } from "@/utils/date.utils";
import { generateUniqueVerificationCode } from "@/utils/verification.utils";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Students");

interface AddressInput {
  street?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
}

interface ContactPersonInput {
  type?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobile?: string;
  address?: AddressInput;
}

interface EmployerInput {
  companyName?: string;
  address?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactSalutation?: string;
}

interface StudentInput {
  firstName?: unknown;
  lastName?: unknown;
  dateOfBirth?: unknown;
  verificationCode?: unknown;
  // Additional fields from comprehensive CSV
  birthName?: unknown;
  gender?: unknown;
  birthCountry?: unknown;
  birthplace?: unknown;
  religion?: unknown;
  nationality?: unknown;
  secondNationality?: unknown;
  originCountry?: unknown;
  immigrationYear?: unknown;
  familyLanguage?: unknown;
  phone?: unknown;
  mobile?: unknown;
  email?: unknown;
  address?: AddressInput;
  schoolEntryDate?: unknown;
  className?: unknown;
  previousSchool?: unknown;
  previousSchoolLevel?: unknown;
  previousSchoolType?: unknown;
  degrees?: unknown;
  profession?: unknown;
  trainingStartDate?: unknown;
  employer?: EmployerInput;
  contactPersons?: ContactPersonInput[];
  [key: string]: unknown;
}

interface ShapedStudentDoc {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  firstNameNorm: string;
  lastNameNorm: string;
  verificationCode?: string;
  status: string;
  // Optional fields
  birthName?: string;
  gender?: "male" | "female" | "diverse";
  birthCountry?: string;
  birthplace?: string;
  religion?: string;
  nationality?: string;
  secondNationality?: string;
  familyLanguage?: string;
  immigrationYear?: number;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
  };
  schoolEntryDate?: Date;
  currentClassName?: string;
  currentClass?: Types.ObjectId | null;
  previousSchool?: string;
  previousSchoolLevel?: string;
  previousSchoolType?: string;
  degrees?: string;
  profession?: string;
  trainingStartDate?: Date;
  employer?: {
    companyName?: string;
    address?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    contactSalutation?: string;
  };
  contactPersons?: Array<{
    type: string;
    firstName: string;
    lastName: string;
    phone?: string;
    mobile?: string;
    address?: {
      street?: string;
      city?: string;
      zip?: string;
    };
  }>;
}

type ShapedStudentInvalid = { ok: false; reason: string };
type ShapedStudentValid = {
  ok: true;
  doc: ShapedStudentDoc;
};
type ShapedStudent = ShapedStudentInvalid | ShapedStudentValid;

/**
 * Map gender from various formats to standard enum value
 */
function mapGender(value: unknown): "male" | "female" | "diverse" | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.toLowerCase().trim();
  if (v === "m" || v === "männlich" || v === "male") return "male";
  if (v === "w" || v === "f" || v === "weiblich" || v === "female")
    return "female";
  if (v === "d" || v === "divers" || v === "diverse") return "diverse";
  return undefined;
}

/**
 * Safely get string value from unknown input
 */
function getString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return undefined;
}

/**
 * Safely get number value from unknown input
 */
function getNumber(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const num = parseInt(value, 10);
    if (!isNaN(num)) return num;
  }
  return undefined;
}

const shapeStudent = (row: StudentInput): ShapedStudent => {
  const firstName =
    typeof row?.firstName === "string" ? row.firstName.trim() : "";
  const lastName = typeof row?.lastName === "string" ? row.lastName.trim() : "";
  const dob = parseDate(row?.dateOfBirth);

  if (!firstName || !lastName || !dob) {
    return {
      ok: false as const,
      reason: "Invalid firstName/lastName/dateOfBirth",
    };
  }

  // Build the base document
  const doc: ShapedStudentDoc = {
    firstName,
    lastName,
    dateOfBirth: dob,
    firstNameNorm: norm(firstName),
    lastNameNorm: norm(lastName),
    status: "imported",
  };

  // Add optional fields if present
  const birthName = getString(row.birthName);
  if (birthName) doc.birthName = birthName;

  const gender = mapGender(row.gender);
  if (gender) doc.gender = gender;

  const birthCountry = getString(row.birthCountry);
  if (birthCountry) doc.birthCountry = birthCountry;

  const birthplace = getString(row.birthplace);
  if (birthplace) doc.birthplace = birthplace;

  const religion = getString(row.religion);
  if (religion) doc.religion = religion;

  const nationality = getString(row.nationality);
  if (nationality) doc.nationality = nationality;

  const secondNationality = getString(row.secondNationality);
  if (secondNationality) doc.secondNationality = secondNationality;

  const familyLanguage = getString(row.familyLanguage);
  if (familyLanguage) doc.familyLanguage = familyLanguage;

  const immigrationYear = getNumber(row.immigrationYear);
  if (immigrationYear) doc.immigrationYear = immigrationYear;

  const phone = getString(row.phone) || getString(row.mobile);
  if (phone) doc.phone = phone;

  const email = getString(row.email);
  if (email) doc.email = email.toLowerCase();

  // Address
  if (row.address && typeof row.address === "object") {
    const addr = row.address;
    if (addr.street || addr.city || addr.zip) {
      doc.address = {
        street: getString(addr.street),
        city: getString(addr.city),
        zip: getString(addr.zip),
      };
    }
  }

  // School info
  const schoolEntryDate = parseDate(row.schoolEntryDate);
  if (schoolEntryDate) doc.schoolEntryDate = schoolEntryDate;

  const className = getString(row.className);
  if (className) doc.currentClassName = className;

  // Previous education
  const previousSchool = getString(row.previousSchool);
  if (previousSchool) doc.previousSchool = previousSchool;

  const previousSchoolLevel = getString(row.previousSchoolLevel);
  if (previousSchoolLevel) doc.previousSchoolLevel = previousSchoolLevel;

  const previousSchoolType = getString(row.previousSchoolType);
  if (previousSchoolType) doc.previousSchoolType = previousSchoolType;

  const degrees = getString(row.degrees);
  if (degrees) doc.degrees = degrees;

  // Vocational info
  const profession = getString(row.profession);
  if (profession) doc.profession = profession;

  const trainingStartDate = parseDate(row.trainingStartDate);
  if (trainingStartDate) doc.trainingStartDate = trainingStartDate;

  // Employer
  if (row.employer && typeof row.employer === "object") {
    const emp = row.employer;
    if (emp.companyName) {
      doc.employer = {
        companyName: getString(emp.companyName),
        address: getString(emp.address),
        contactName: getString(emp.contactName),
        contactEmail: getString(emp.contactEmail),
        contactPhone: getString(emp.contactPhone),
        contactSalutation: getString(emp.contactSalutation),
      };
    }
  }

  // Contact persons
  if (Array.isArray(row.contactPersons) && row.contactPersons.length > 0) {
    const validContacts = row.contactPersons
      .filter((cp) => cp && (cp.firstName || cp.lastName))
      .map((cp) => ({
        type: getString(cp.type) || "guardian",
        firstName: getString(cp.firstName) || "",
        lastName: getString(cp.lastName) || "",
        phone: getString(cp.phone),
        mobile: getString(cp.mobile),
        address:
          cp.address && (cp.address.street || cp.address.city || cp.address.zip)
            ? {
                street: getString(cp.address.street),
                city: getString(cp.address.city),
                zip: getString(cp.address.zip),
              }
            : undefined,
      }));

    if (validContacts.length > 0) {
      doc.contactPersons = validContacts;
    }
  }

  return {
    ok: true as const,
    doc,
  };
};

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      200,
      Math.max(1, Number(searchParams.get("limit") || 25)),
    );
    const skip = (page - 1) * limit;
    const unassigned = searchParams.get("unassigned") === "true";
    const forAssignment = searchParams.get("forAssignment") === "true";

    // Build filter query
    const filter: Record<string, unknown> = {};
    if (unassigned) {
      filter.currentClass = null;
      filter.active = true;
    } else if (forAssignment) {
      // For class assignment: get all active students (including those already assigned)
      filter.active = true;
    }

    // Sort by name for assignment dropdown, by date for other views
    const sortOrder: Record<string, 1 | -1> = forAssignment
      ? { lastName: 1, firstName: 1 }
      : { createdAt: -1, _id: -1 };

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate("currentClass", "name")
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments(filter),
    ]);

    return NextResponse.json(
      { students, page, limit, total, pages: Math.ceil(total / limit) },
      { status: 200 },
    );
  } catch (error) {
    logger.error(
      "Failed to retrieve Students",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const rows: StudentInput[] = body?.students;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 },
      );
    }

    const prepared = rows.map(shapeStudent);
    const invalid = prepared.filter((p) => !p.ok);
    const docs = prepared
      .filter((p) => p.ok)
      .map((p) => (p as ShapedStudentValid).doc);

    if (docs.length === 0) {
      return NextResponse.json(
        { message: "No valid students in payload", invalid: invalid.length },
        { status: 400 },
      );
    }

    // Link students to existing classes
    const classNames = [
      ...new Set(
        docs
          .map((d) => d.currentClassName?.trim())
          .filter((name): name is string => !!name),
      ),
    ];

    const classMap = new Map<string, Types.ObjectId>();
    if (classNames.length > 0) {
      const existingClasses = await Class.find(
        { name: { $in: classNames } },
        { name: 1, _id: 1 },
      ).lean();

      existingClasses.forEach((c) => {
        classMap.set(c.name, c._id as Types.ObjectId);
      });

      // Set currentClass ObjectId on docs where class exists
      for (const doc of docs) {
        if (doc.currentClassName) {
          const classId = classMap.get(doc.currentClassName);
          doc.currentClass = classId || null;
        }
      }
    }

    const generatedCodes = new Set<string>();

    for (const doc of docs) {
      if (!doc.verificationCode) {
        doc.verificationCode = await generateUniqueVerificationCode(
          async (code: string) => {
            if (generatedCodes.has(code)) {
              return true;
            }

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

        generatedCodes.add(doc.verificationCode);
      }
    }

    // Create students with verification codes
    const result = await Student.create(docs);

    // Update class student counts for affected classes
    if (classMap.size > 0) {
      const classCountMap = new Map<string, number>();
      for (const student of result) {
        if (student.currentClass) {
          const classId = student.currentClass.toString();
          classCountMap.set(classId, (classCountMap.get(classId) || 0) + 1);
        }
      }

      if (classCountMap.size > 0) {
        const bulkOps = Array.from(classCountMap.entries()).map(
          ([classId, count]) => ({
            updateOne: {
              filter: { _id: classId },
              update: { $inc: { studentCount: count } },
            },
          }),
        );
        await Class.bulkWrite(bulkOps);
      }
    }

    // Log audit entry
    await createAuditLog(
      {
        action: "student.create",
        category: "student",
        description: tServer("audit.descriptions.createdStudents", {
          count: result.length,
        }),
        status: "success",
        metadata: {
          studentIds: result.map((s) => s._id.toString()),
          studentNames: result.map((s) => `${s.firstName} ${s.lastName}`),
          affectedCount: result.length,
          invalidCount: invalid.length,
        },
      },
      request as NextRequest,
    );

    return NextResponse.json(
      {
        created: result,
        createdCount: result.length,
        invalidCount: invalid.length,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error(
      "Failed to create Students",
      error instanceof Error ? error.message : String(error),
    );

    // Log audit entry for failure
    await createAuditLog(
      {
        action: "student.create",
        category: "student",
        description: tServer("audit.descriptions.failedCreateStudents"),
        status: "failure",
        metadata: {
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      },
      request as NextRequest,
    );

    interface BulkWriteError {
      name: string;
      code?: number;
      writeErrors?: unknown[];
    }

    const isBulkWriteError = (err: unknown): err is BulkWriteError =>
      typeof err === "object" &&
      err !== null &&
      "name" in err &&
      (err as { name?: unknown }).name === "BulkWriteError" &&
      ("code" in err || "writeErrors" in err);

    const message = isBulkWriteError(error)
      ? "Bulk insert completed with duplicates or errors"
      : `Internal Server error`;

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const ids: string[] = body?.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 },
      );
    }

    // Fetch student data before deletion for audit log and class count updates
    const students = await Student.find({ _id: { $in: ids } })
      .select("firstName lastName currentClass")
      .lean();

    // Aggregate class IDs and counts for students being deleted
    const classCountMap = new Map<string, number>();
    for (const student of students) {
      if (student.currentClass) {
        const classId = student.currentClass.toString();
        classCountMap.set(classId, (classCountMap.get(classId) || 0) + 1);
      }
    }

    const result = await Student.deleteMany({ _id: { $in: ids } });

    // Update class student counts after successful deletion
    if (classCountMap.size > 0 && result.deletedCount > 0) {
      const Class = (await import("@/models/Class")).default;
      const bulkOps = Array.from(classCountMap.entries()).map(
        ([classId, count]) => ({
          updateOne: {
            filter: { _id: classId },
            update: { $inc: { studentCount: -count } },
          },
        }),
      );
      await Class.bulkWrite(bulkOps);
    }

    // Log audit entry
    await createAuditLog(
      {
        action: "student.delete",
        category: "student",
        description: tServer("audit.descriptions.deletedStudents", {
          count: result.deletedCount,
        }),
        status: "success",
        metadata: {
          studentIds: ids,
          studentNames: students.map((s) => `${s.firstName} ${s.lastName}`),
          affectedCount: result.deletedCount,
        },
      },
      request as NextRequest,
    );

    return NextResponse.json(
      {
        deletedCount: result.deletedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error(
      "Failed to delete Students",
      error instanceof Error ? error.message : String(error),
    );

    // Log audit entry for failure
    await createAuditLog(
      {
        action: "student.delete",
        category: "student",
        description: tServer("audit.descriptions.failedDeleteStudents"),
        status: "failure",
        metadata: {
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      },
      request as NextRequest,
    );

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
