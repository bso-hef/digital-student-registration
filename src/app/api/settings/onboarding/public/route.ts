import { dbConnect } from "@/lib/config/mongo";
import { applyOnboardingFieldConfigDefaults } from "@/lib/config/onboarding";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import Logger from "@/lib/server-logger";
import { OnboardingSettings } from "@/types/settings";
import { NextRequest, NextResponse } from "next/server";

import AppSettings from "@/models/AppSettings";

export const runtime = "nodejs";

const RATE_LIMIT = 20;
const RATE_WINDOW_SECONDS = 60;

const logger = new Logger("API <<==>> Public Settings::Onboarding");

/**
 * GET /api/settings/onboarding/public
 *
 * Returns only the settings required by the unauthenticated student workflow.
 * The endpoint is read-only and throttled per client IP.
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(
      `settings:onboarding:public:${ip}`,
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
      .select("onboarding")
      .lean()) as { onboarding?: OnboardingSettings } | null;
    const onboarding = applyOnboardingFieldConfigDefaults(
      settings?.onboarding ??
        (new AppSettings({}).toObject().onboarding as OnboardingSettings),
    );

    return NextResponse.json(
      {
        success: true,
        data: { onboarding },
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    logger.error(
      "Failed to fetch public onboarding settings",
      error instanceof Error ? error.message : String(error),
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch onboarding settings",
      },
      { status: 500 },
    );
  }
}
