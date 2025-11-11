import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import { tServer } from "@/lib/server-i18n";
import Logger from "@/lib/server-logger";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import { NextRequest, NextResponse } from "next/server";

import AppSettings from "@/models/AppSettings";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Settings::Onboarding");

/**
 * PATCH /api/settings/onboarding
 * Updates onboarding settings specifically
 */
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    if (!body || !body.onboarding || typeof body.onboarding !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body. Expected { onboarding: {...} }",
        },
        { status: 400 },
      );
    }

    // Get or create settings document
    let settings = await AppSettings.findOne();
    const oldOnboardingSettings = settings?.onboarding;

    if (!settings) {
      logger.info(
        "No settings found, creating new settings document with onboarding settings",
      );
      settings = new AppSettings({ onboarding: body.onboarding });
    } else {
      // Deep merge onboarding settings
      if (!settings.onboarding) {
        settings.onboarding = body.onboarding;
      } else {
        // Update individual onboarding properties
        Object.keys(body.onboarding).forEach((key) => {
          if (settings.onboarding) {
            (settings.onboarding as Record<string, unknown>)[key] =
              body.onboarding[key];
          }
        });
      }

      settings.markModified("onboarding");
    }

    await settings.save();

    // Log audit entry
    await createAuditLog(
      {
        action: "settings.update_onboarding",
        category: "settings",
        description: tServer("audit.descriptions.updatedOnboardingSettings"),
        status: "success",
        metadata: {
          settingCategory: "onboarding",
          changedFields: Object.keys(body.onboarding),
          oldValues: oldOnboardingSettings,
          newValues: body.onboarding,
        },
      },
      request,
    );

    logger.info("Onboarding settings updated successfully");

    return NextResponse.json(
      {
        success: true,
        data: settings.toObject(),
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to update onboarding settings", error);

    // Log audit entry for failure
    await createAuditLog(
      {
        action: "settings.update_onboarding",
        category: "settings",
        description: tServer(
          "audit.descriptions.failedUpdateOnboardingSettings",
        ),
        status: "failure",
        metadata: {
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      },
      request,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update onboarding settings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/settings/onboarding
 * Fetches only the onboarding settings
 * Public endpoint - no authentication required for invited students
 */
export async function GET() {
  try {
    await dbConnect();

    let settings = await AppSettings.findOne().lean();

    if (!settings) {
      logger.info("No settings found, returning default onboarding settings");
      const defaultSettings = new AppSettings({});
      settings = await defaultSettings.save();
    }

    logger.info("Onboarding settings fetched successfully");

    return NextResponse.json(
      {
        success: true,
        data: settings, // Return full AppSettings object
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to fetch onboarding settings", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch onboarding settings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
