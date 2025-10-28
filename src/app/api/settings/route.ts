import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
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

    if (!settings) {
      logger.info("No settings found, creating new settings document");
      settings = new AppSettings(body);
    } else {
      // Update existing settings
      Object.assign(settings, body);
    }

    await settings.save();

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
