import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import Class from "@/models/Class";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Classes");

type PrimitiveDateInput = string | number | Date;

const isPrimitiveDateInput = (v: unknown): v is PrimitiveDateInput =>
  v instanceof Date || typeof v === "string" || typeof v === "number";

export const toDateOrNull = (v: unknown): Date | null => {
  if (v == null) return null;
  if (!isPrimitiveDateInput(v)) return null;

  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

interface ClassInput {
  schoolYearFrom?: unknown;
  schoolYearTo?: unknown;
  name?: unknown;
  grade?: unknown;
  isVocational?: unknown;
  requiresEmployerInfo?: unknown;
  active?: unknown;
  [key: string]: unknown;
}

type ShapedInvalid = { ok: false; reason: string };
type ShapedValid = {
  ok: true;
  doc: {
    schoolYearFrom: Date;
    schoolYearTo: Date;
    name: string;
    grade: number | null;
    isVocational: boolean;
    requiresEmployerInfo: boolean;
    active: boolean;
  };
};
type ShapedClass = ShapedInvalid | ShapedValid;

const shapeClass = (row: ClassInput): ShapedClass => {
  const schoolYearFrom = toDateOrNull(row?.schoolYearFrom);
  const schoolYearTo = toDateOrNull(row?.schoolYearTo);
  const name = typeof row?.name === "string" ? row.name.trim() : "";

  // grade: number|null erlaubt; wenn number -> ganzzahlig 1..13
  let grade: number | null;
  if (row?.grade === null || row?.grade === undefined || row?.grade === "") {
    grade = null;
  } else if (
    typeof row?.grade === "number" &&
    Number.isInteger(row.grade) &&
    row.grade >= 1 &&
    row.grade <= 13
  ) {
    grade = row.grade;
  } else {
    return {
      ok: false,
      reason: "Invalid grade (must be integer 1..13 or null)",
    };
  }

  const isVocational = row?.isVocational === true;
  const requiresEmployerInfo = row?.requiresEmployerInfo === true;
  const active = row?.active === false ? false : true; // default true

  if (!schoolYearFrom || !schoolYearTo) {
    return { ok: false, reason: "schoolYearFrom/To missing or invalid" };
  }
  if (schoolYearTo <= schoolYearFrom) {
    return { ok: false, reason: "schoolYearTo must be after schoolYearFrom" };
  }
  if (!name) {
    return { ok: false, reason: "name required" };
  }

  return {
    ok: true,
    doc: {
      schoolYearFrom,
      schoolYearTo,
      name,
      grade,
      isVocational,
      requiresEmployerInfo,
      active,
    },
  };
};

// ---------- GET ----------
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

    const [classes, total] = await Promise.all([
      Class.find({})
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Class.countDocuments({}),
    ]);

    return NextResponse.json(
      { classes, page, limit, total, pages: Math.ceil(total / limit) },
      { status: 200 },
    );
  } catch (error) {
    logger.error(
      "Failed to retrieve Classes",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// ---------- POST (Batch Create) ----------
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // analog zu deinem Service: { classes: ClassInput[] }
    const rows: ClassInput[] = body?.classes;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 },
      );
    }

    const prepared = rows.map(shapeClass);
    const invalid = prepared
      .map((p, i) => ({ i, p }))
      .filter((x) => !x.p.ok)
      .map((x) => ({ index: x.i, reason: (x.p as ShapedInvalid).reason }));

    const docs = prepared
      .filter((p): p is ShapedValid => p.ok)
      .map((p) => p.doc);

    if (docs.length === 0) {
      return NextResponse.json(
        {
          message: "No valid classes in payload",
          invalidCount: invalid.length,
          errors: invalid,
        },
        { status: 400 },
      );
    }

    const result = await Class.insertMany(docs, { ordered: false });

    return NextResponse.json(
      {
        classes: result, // gleiches Feldschema wie GET (einfacher für Reducer)
        createdCount: result.length,
        invalidCount: invalid.length,
        errors: invalid,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error(
      "Failed to create Classes",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// ---------- DELETE (Batch) ----------
export async function DELETE(request: NextRequest) {
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

    const res = await Class.deleteMany({ _id: { $in: ids } });
    return NextResponse.json(
      { deletedCount: res.deletedCount || 0 },
      { status: 200 },
    );
  } catch (error) {
    logger.error(
      "Failed to delete Classes",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
