import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import Class from "@/models/Class";
import Student from "@/models/Student";
import { ClassInterface } from "@/types/class";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Class Students");

/**
 * GET /api/classes/[classId]/students
 * Fetch all students in a specific class
 */
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

    // Verify class exists
    const classExists = (await Class.findById(
      classId,
    ).lean()) as ClassInterface | null;
    if (!classExists) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    // Fetch students in this class
    const students = await Student.find({
      currentClass: new mongoose.Types.ObjectId(classId),
      active: true,
    })
      .lean()
      .sort({ lastName: 1, firstName: 1 });

    logger.info(`Retrieved ${students.length} students for class ${classId}`);

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    logger.error(
      `Failed to retrieve students for class ${params.classId}`,
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/classes/[classId]/students
 * Add student(s) to a class
 * Body: { studentIds: string[] }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { classId: string } },
) {
  try {
    await dbConnect();
    const { classId } = await params;
    const body = await request.json();
    const { studentIds } = body;

    if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
      return NextResponse.json(
        { message: "Invalid Class ID" },
        { status: 400 },
      );
    }

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { message: "studentIds array is required" },
        { status: 400 },
      );
    }

    // Verify all student IDs are valid
    const invalidIds = studentIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id),
    );
    if (invalidIds.length > 0) {
      return NextResponse.json(
        { message: "Invalid student IDs provided" },
        { status: 400 },
      );
    }

    // Verify class exists and get its data
    const classData = (await Class.findById(
      classId,
    ).lean()) as ClassInterface | null;
    if (!classData) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    // Calculate school year string from dates
    if (!classData.schoolYearFrom || !classData.schoolYearTo) {
      return NextResponse.json(
        { message: "Class missing school year dates" },
        { status: 400 },
      );
    }

    const schoolYearFrom = new Date(classData.schoolYearFrom!).getFullYear();
    const schoolYearTo = new Date(classData.schoolYearTo!).getFullYear();
    const schoolYear = `${schoolYearFrom}/${schoolYearTo}`;

    const now = new Date();
    const classObjectId = new mongoose.Types.ObjectId(classId);

    // Update students
    const updateResult = await Student.updateMany(
      {
        _id: { $in: studentIds.map((id) => new mongoose.Types.ObjectId(id)) },
        active: true,
      },
      {
        $set: { currentClass: classObjectId },
        $push: {
          classHistory: {
            classId: classObjectId,
            schoolYear,
            startDate: now,
            endDate: null,
            note: "",
          },
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        {
          message:
            "No students were updated. They may not exist or are already in this class.",
        },
        { status: 400 },
      );
    }

    // Update class student count
    await Class.findByIdAndUpdate(classId, {
      $inc: { studentCount: updateResult.modifiedCount },
    });

    logger.info(
      `Added ${updateResult.modifiedCount} students to class ${classId}`,
    );

    return NextResponse.json(
      {
        message: "Students added to class successfully",
        count: updateResult.modifiedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error(
      `Failed to add students to class ${params.classId}`,
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/classes/[classId]/students
 * Remove student(s) from a class
 * Body: { studentIds: string[] }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { classId: string } },
) {
  try {
    await dbConnect();
    const { classId } = await params;
    const body = await request.json();
    const { studentIds } = body;

    if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
      return NextResponse.json(
        { message: "Invalid Class ID" },
        { status: 400 },
      );
    }

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { message: "studentIds array is required" },
        { status: 400 },
      );
    }

    // Verify all student IDs are valid
    const invalidIds = studentIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id),
    );
    if (invalidIds.length > 0) {
      return NextResponse.json(
        { message: "Invalid student IDs provided" },
        { status: 400 },
      );
    }

    const now = new Date();
    const classObjectId = new mongoose.Types.ObjectId(classId);

    // Update students: set currentClass to null and update classHistory endDate
    const students = await Student.find({
      _id: { $in: studentIds.map((id) => new mongoose.Types.ObjectId(id)) },
      currentClass: classObjectId,
      active: true,
    });

    let modifiedCount = 0;

    for (const student of students) {
      const historyIndex = student.classHistory.findIndex(
        (entry: {
          classId: mongoose.Types.ObjectId | string;
          endDate: Date | null;
        }) => entry.classId.toString() === classId && entry.endDate === null,
      );

      if (historyIndex !== -1) {
        student.classHistory[historyIndex].endDate = now;
      }

      student.currentClass = null;
      await student.save();
      modifiedCount++;
    }

    if (modifiedCount === 0) {
      return NextResponse.json(
        { message: "No students were removed. They may not be in this class." },
        { status: 400 },
      );
    }

    // Update class student count
    await Class.findByIdAndUpdate(classId, {
      $inc: { studentCount: -modifiedCount },
    });

    logger.info(`Removed ${modifiedCount} students from class ${classId}`);

    return NextResponse.json(
      {
        message: "Students removed from class successfully",
        count: modifiedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error(
      `Failed to remove students from class ${params.classId}`,
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
