import { dbConnect } from "@/lib/config/mongo";
import { tServer } from "@/lib/server-i18n";
import Logger from "@/lib/server-logger";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import { NextRequest, NextResponse } from "next/server";

import AppSettings from "@/models/AppSettings";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Settings");

/**
 * GET /api/settings
 * Fetches the current application settings
 */
export async function GET() {
  try {
    await dbConnect();

    // Get the first (and only) settings document, or create default if none exists
    let settings = await AppSettings.findOne().lean();

    if (!settings) {
      logger.info("No settings found, creating default settings");
      const defaultSettings = new AppSettings({});
      settings = await defaultSettings.save();
    }

    logger.info("Settings fetched successfully");

    return NextResponse.json(
      {
        success: true,
        data: settings,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to fetch settings", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch settings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/settings
 * Updates application settings
 */
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
        },
        { status: 400 },
      );
    }

    // Get or create settings document
    let settings = await AppSettings.findOne();
    const oldSettings = settings?.toObject();

    if (!settings) {
      logger.info("No settings found, creating new settings document");
      settings = new AppSettings(body);
    } else {
      // Update existing settings
      Object.assign(settings, body);
    }

    await settings.save();

    // Log audit entry
    await createAuditLog(
      {
        action: "settings.update_general",
        category: "settings",
        description: tServer("audit.descriptions.updatedGeneralSettings"),
        status: "success",
        metadata: {
          settingCategory: "general",
          changedFields: Object.keys(body),
          oldValues: oldSettings,
          newValues: body,
        },
      },
      request,
    );

    logger.info("Settings updated successfully");

    return NextResponse.json(
      {
        success: true,
        data: settings.toObject(),
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to update settings", error);

    // Log audit entry for failure
    await createAuditLog(
      {
        action: "settings.update_general",
        category: "settings",
        description: tServer("audit.descriptions.failedUpdateGeneralSettings"),
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
        error: "Failed to update settings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
