import { dbConnect } from "@/lib/config/mongo";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import Logger from "@/lib/server-logger";
import { AgreementItem } from "@/types/settings";
import { NextRequest, NextResponse } from "next/server";

import AppSettings from "@/models/AppSettings";

export const runtime = "nodejs";

const RATE_LIMIT = 20;
const RATE_WINDOW_SECONDS = 60;

const logger = new Logger("API <<==>> Public Settings::Agreements");

/**
 * GET /api/settings/agreements/public
 *
 * Returns the enabled agreements required by the unauthenticated student
 * onboarding workflow. The endpoint is read-only and throttled per client IP.
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(
      `settings:agreements:public:${ip}`,
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

    const settings = (await AppSettings.findOne()
      .select("agreements")
      .lean()) as {
      agreements?: { agreements?: AgreementItem[] };
    } | null;

    const agreements = (settings?.agreements?.agreements ?? [])
      .filter((agreement) => agreement.enabled)
      .sort((a, b) => a.order - b.order);

    return NextResponse.json(
      {
        success: true,
        data: { agreements },
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    logger.error(
      "Failed to fetch public agreement settings",
      error instanceof Error ? error.message : String(error),
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch agreement settings",
      },
      { status: 500 },
    );
  }
}
