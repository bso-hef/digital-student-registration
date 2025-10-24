import { dbConnect } from "@/lib/config/mongo";
import { norm } from "@/lib/config/norm";
import Logger from "@/lib/server-logger";
import Student from "@/models/Student";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Students");

const parseDob = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value !== "string") return null;

  const iso = new Date(value);
  if (!isNaN(iso.getTime())) return iso;

  const m = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (m) {
    const [, dd, mm, yyyy] = m;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

interface StudentInput {
  firstName?: unknown;
  lastName?: unknown;
  dateOfBirth?: unknown;
  [key: string]: unknown;
}

type ShapedStudentInvalid = { ok: false; reason: string };
type ShapedStudentValid = {
  ok: true;
  doc: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    firstNameNorm: string;
    lastNameNorm: string;
    status: string;
  };
};
type ShapedStudent = ShapedStudentInvalid | ShapedStudentValid;

const shapeStudent = (row: StudentInput): ShapedStudent => {
  const firstName =
    typeof row?.firstName === "string" ? row.firstName.trim() : "";
  const lastName = typeof row?.lastName === "string" ? row.lastName.trim() : "";
  const dob = parseDob(row?.dateOfBirth);

  if (!firstName || !lastName || !dob) {
    return {
      ok: false as const,
      reason: "Invalid firstName/lastName/dateOfBirth",
    };
  }

  return {
    ok: true as const,
    doc: {
      firstName,
      lastName,
      dateOfBirth: dob,
      firstNameNorm: norm(firstName),
      lastNameNorm: norm(lastName),
      status: "imported",
    },
  };
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      200,
      Math.max(1, Number(searchParams.get("limit") || 25)),
    );
    const skip = (page - 1) * limit;
    const unassigned = searchParams.get("unassigned") === "true";

    // Build filter query
    const filter: Record<string, unknown> = {};
    if (unassigned) {
      filter.currentClass = null;
      filter.active = true;
    }

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate("currentClass", "name")
        .sort({ createdAt: -1, _id: -1 })
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

    const result = await Student.insertMany(docs, { ordered: false });

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
    const isBulkWriteError = (err: unknown): err is { name: string } =>
      typeof err === "object" &&
      err !== null &&
      "name" in err &&
      (err as { name?: unknown }).name === "BulkWriteError";

    const message = isBulkWriteError(error)
      ? "Bulk insert completed with duplicates or errors"
      : `Internal Server error`;

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const ids: string[] = body?.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 },
      );
    }

    const result = await Student.deleteMany({ _id: { $in: ids } });
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
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
