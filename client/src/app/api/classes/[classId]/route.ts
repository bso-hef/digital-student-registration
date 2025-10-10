import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import Class from "@/models/Class";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

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

    const classData = await Class.findById(classId).lean();

    if (!classData) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(classData, { status: 200 });
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
