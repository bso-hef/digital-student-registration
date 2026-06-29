import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import Class from "@/models/Class";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Public Classes");

export async function GET() {
  try {
    await dbConnect();

    const classes = await Class.find({ active: true })
      .select(
        "_id schoolYearFrom schoolYearTo name grade isVocational requiresEmployerInfo active incomplete studentCount",
      )
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ classes }, { status: 200 });
  } catch (error) {
    logger.error(
      "Failed to retrieve public classes",
      error instanceof Error ? error.message : String(error),
    );

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
