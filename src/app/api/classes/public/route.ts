import { dbConnect } from "@/lib/config/mongo";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import Logger from "@/lib/server-logger";
import Class from "@/models/Class";
import { NextRequest, NextResponse } from "next/server";

// This endpoint is public (no auth) and is an existence oracle, so throttle it
// per IP to slow down enumeration.
const RATE_LIMIT = 20;
const RATE_WINDOW_SECONDS = 60;

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Public Classes");

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(
      `classes:find:${ip}`,
      RATE_LIMIT,
      RATE_WINDOW_SECONDS,
    );
    if (!limit.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    await dbConnect();

    const classes = await Class.find({ active: true })
      .select("_id name requiresEmployerInfo isVocational")
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
