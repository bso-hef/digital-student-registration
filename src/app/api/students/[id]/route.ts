import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import { tServer } from "@/lib/server-i18n";
import Logger from "@/lib/server-logger";
import Class from "@/models/Class";
import Student from "@/models/Student";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Student by ID");

/**
 * GET /api/students/[id]
 * Gets a single student by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Public endpoint - allows invited students to access their data for onboarding
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    // Find student by ID
    const student = await Student.findById(id).populate("currentClass").lean();

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    logger.info(`Retrieved student: ${id}`);

    return NextResponse.json(
      {
        data: student,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error retrieving student:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve student",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/students/[id]
 * Updates a single student (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Extract id at function scope for access in catch block
  const { id } = await params;

  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    // Find student first
    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if currentClass is changing
    const isClassChanging = body.hasOwnProperty("currentClass");
    const oldClassId = isClassChanging
      ? student.currentClass?.toString() || null
      : null;
    const newClassId = isClassChanging
      ? body.currentClass?.toString() || null
      : null;

    // Only process if class is actually changing
    const shouldUpdateCounts = isClassChanging && oldClassId !== newClassId;

    // Fetch new class data if we're assigning a class (for schoolYear calculation)
    let newClassData: { schoolYearFrom: Date; schoolYearTo: Date } | null =
      null;
    if (shouldUpdateCounts && newClassId) {
      newClassData = (await Class.findById(newClassId).lean()) as {
        schoolYearFrom: Date;
        schoolYearTo: Date;
      } | null;
      if (!newClassData) {
        return NextResponse.json(
          { error: "New class not found" },
          { status: 404 },
        );
      }
    }

    // Update student fields
    Object.assign(student, body);

    // Update classHistory if class changed
    if (shouldUpdateCounts) {
      const now = new Date();

      // Close old class history entry
      if (oldClassId && student.classHistory) {
        const oldEntry = student.classHistory.find(
          (entry: {
            classId?: mongoose.Types.ObjectId | string;
            endDate?: Date | null;
          }) => entry.classId?.toString() === oldClassId && !entry.endDate,
        );
        if (oldEntry) {
          oldEntry.endDate = now;
        }
      }

      // Add new class history entry
      if (newClassId && newClassData) {
        // Calculate schoolYear string from class dates
        const schoolYearFrom = new Date(
          newClassData.schoolYearFrom,
        ).getFullYear();
        const schoolYearTo = new Date(newClassData.schoolYearTo).getFullYear();
        const schoolYear = `${schoolYearFrom}/${schoolYearTo}`;

        if (!student.classHistory) {
          student.classHistory = [];
        }
        student.classHistory.push({
          classId: new mongoose.Types.ObjectId(newClassId),
          schoolYear,
          startDate: now,
          endDate: null,
          note: "",
        });
      }
    }

    // Save student to trigger pre-save hooks (including verification code generation)
    await student.save();

    // Update class counts atomically using bulkWrite
    if (shouldUpdateCounts) {
      const bulkOps: Array<{
        updateOne: {
          filter: { _id: mongoose.Types.ObjectId };
          update: { $inc: { studentCount: number } };
        };
      }> = [];

      // Decrement old class count
      if (oldClassId) {
        bulkOps.push({
          updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(oldClassId) },
            update: { $inc: { studentCount: -1 } },
          },
        });
      }

      // Increment new class count
      if (newClassId) {
        bulkOps.push({
          updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(newClassId) },
            update: { $inc: { studentCount: 1 } },
          },
        });
      }

      // Execute all count updates atomically
      if (bulkOps.length > 0) {
        await Class.bulkWrite(bulkOps);
      }
    }

    // Populate after save
    await student.populate("currentClass");

    logger.info(`Updated student: ${id}`);

    // Create audit log for successful update
    await createAuditLog(
      {
        action: "student.update",
        category: "student",
        description: tServer("audit.descriptions.updatedStudent", {
          name: `${student.firstName} ${student.lastName}`,
        }),
        status: "success",
        metadata: {
          studentId: id,
          studentName: `${student.firstName} ${student.lastName}`,
          updatedFields: Object.keys(body),
        },
      },
      request,
    );

    return NextResponse.json(
      {
        data: student,
        message: "Student updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error updating student:", error);

    // Create audit log for failed update
    await createAuditLog(
      {
        action: "student.update",
        category: "student",
        description: tServer("audit.descriptions.failedUpdateStudent"),
        status: "failure",
        metadata: {
          studentId: id,
          error: error instanceof Error ? error.message : String(error),
        },
      },
      request,
    );

    // Check if it's a validation error
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update student",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/students/[id]
 * Deletes a single student (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Extract id at function scope for access in catch block
  const { id } = await params;

  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find student first to get info for audit log
    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Store student info before deletion
    const studentName = `${student.firstName} ${student.lastName}`;

    // Delete the student
    await Student.findByIdAndDelete(id);

    logger.info(`Deleted student: ${id}`);

    // Create audit log for successful deletion
    await createAuditLog(
      {
        action: "student.delete",
        category: "student",
        description: tServer("audit.descriptions.deletedStudent", {
          name: studentName,
        }),
        status: "success",
        metadata: {
          studentId: id,
          studentName,
        },
      },
      request,
    );

    return NextResponse.json(
      {
        message: "Student deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error deleting student:", error);

    // Create audit log for failed deletion
    await createAuditLog(
      {
        action: "student.delete",
        category: "student",
        description: tServer("audit.descriptions.failedDeleteStudent"),
        status: "failure",
        metadata: {
          studentId: id,
          error: error instanceof Error ? error.message : String(error),
        },
      },
      request,
    );

    return NextResponse.json(
      {
        error: "Failed to delete student",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
