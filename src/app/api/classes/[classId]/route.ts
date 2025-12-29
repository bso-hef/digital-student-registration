import { dbConnect } from "@/lib/config/mongo";
import { tServer } from "@/lib/server-i18n";
import Logger from "@/lib/server-logger";
import Class from "@/models/Class";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface ClassLean {
  name: string;
  schoolYearFrom: Date;
  schoolYearTo: Date;
  grade?: number | null;
  isVocational?: boolean;
  requiresEmployerInfo?: boolean;
  studentCount?: number;
  active?: boolean;
  incomplete?: boolean;
}

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Classes");

export async function GET(
  request: NextRequest,
  { params }: { params: { classId: string } },
) {
  try {
    await dbConnect();
    const { classId } = await params;

    if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
      return NextResponse.json(
        { message: "Invalid Class ID" },
        { status: 400 },
      );
    }

    const classData = (await Class.findById(
      classId,
    ).lean()) as ClassLean | null;

    if (!classData) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    // Ensure incomplete field is computed (backwards compatibility)
    const classWithIncomplete = {
      ...classData,
      incomplete:
        classData.incomplete ??
        (classData.grade === null || classData.grade === undefined),
    };

    return NextResponse.json(classWithIncomplete, { status: 200 });
  } catch (error) {
    logger.error(
      `Failed to retrieve Class ${params.classId}`,
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { classId: string } },
) {
  try {
    await dbConnect();
    const { classId } = await params;
    const body = await request.json();

    if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
      return NextResponse.json(
        { message: "Invalid Class ID" },
        { status: 400 },
      );
    }

    // Get old values for audit log
    const oldClass = (await Class.findById(classId).lean()) as ClassLean | null;

    const updatedClass = (await Class.findByIdAndUpdate(classId, body, {
      new: true,
    }).lean()) as ClassLean | null;

    if (!updatedClass || Array.isArray(updatedClass)) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    // Ensure incomplete field is computed (backwards compatibility)
    const classWithIncomplete = {
      ...updatedClass,
      incomplete:
        updatedClass.incomplete ??
        (updatedClass.grade === null || updatedClass.grade === undefined),
    };

    // Log audit entry
    await createAuditLog(
      {
        action: "class.update",
        category: "class",
        description: tServer("audit.descriptions.updatedClass", {
          name: classWithIncomplete.name,
        }),
        status: "success",
        metadata: {
          classId: classId,
          className: classWithIncomplete.name,
          changedFields: Object.keys(body),
          oldValues: oldClass,
          newValues: body,
        },
      },
      request,
    );

    logger.info(`Class ${classId} updated successfully`);
    return NextResponse.json(classWithIncomplete, { status: 200 });
  } catch (error) {
    logger.error(
      `Failed to update Class ${params.classId}`,
      error instanceof Error ? error.message : String(error),
    );

    // Log audit entry for failure
    await createAuditLog(
      {
        action: "class.update",
        category: "class",
        description: tServer("audit.descriptions.failedUpdateClass"),
        status: "failure",
        metadata: {
          classId: params.classId,
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      },
      request,
    );

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
