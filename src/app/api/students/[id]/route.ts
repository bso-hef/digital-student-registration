import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import Student from "@/models/Student";
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
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();

    // Find student first
    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Update fields
    Object.assign(student, body);

    // Save to trigger pre-save hooks (including verification code generation)
    await student.save();

    // Populate after save
    await student.populate("currentClass");

    logger.info(`Updated student: ${id}`);

    return NextResponse.json(
      {
        data: student,
        message: "Student updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error updating student:", error);

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
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    // Find and delete student
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    logger.info(`Deleted student: ${id}`);

    return NextResponse.json(
      {
        message: "Student deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error deleting student:", error);
    return NextResponse.json(
      {
        error: "Failed to delete student",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
