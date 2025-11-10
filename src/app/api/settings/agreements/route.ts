import { auth } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/config/mongo";
import { tServer } from "@/lib/server-i18n";
import Logger from "@/lib/server-logger";
import { createAuditLog } from "@/server/middleware/audit.middleware";
import { NextRequest, NextResponse } from "next/server";

import AppSettings from "@/models/AppSettings";

export const runtime = "nodejs";

const logger = new Logger("API <<==>> Settings::Agreements");

/**
 * Default agreements mapped to StudentData fields
 * All enabled and required by default for student onboarding
 * Keys must match StudentData field names: datenschutz, teilnahmeunterricht, schulordnung, personenabbildung, teamsnutzung
 */
const DEFAULT_AGREEMENTS = [
  {
    id: "datenschutz",
    key: "datenschutz",
    enabled: true,
    required: true,
    order: 0,
    labels: {
      en: "Data Protection Agreement",
      de: "Datenschutzvereinbarung",
    },
    description: {
      en: "I consent to the processing of my personal data in accordance with the data protection policy.",
      de: "Ich willige in die Verarbeitung meiner personenbezogenen Daten gemäß der Datenschutzrichtlinie ein.",
    },
    icon: "PrivacyTip",
  },
  {
    id: "teilnahmeunterricht",
    key: "teilnahmeunterricht",
    enabled: true,
    required: true,
    order: 1,
    labels: {
      en: "Class Participation Consent",
      de: "Einwilligung zur Teilnahme am Unterricht",
    },
    description: {
      en: "I agree to participate in all required classes and activities.",
      de: "Ich verpflichte mich zur Teilnahme an allen erforderlichen Unterrichtsstunden und Aktivitäten.",
    },
    icon: "School",
  },
  {
    id: "schulordnung",
    key: "schulordnung",
    enabled: true,
    required: true,
    order: 2,
    labels: {
      en: "School Rules Acceptance",
      de: "Anerkennung der Schulordnung",
    },
    description: {
      en: "I have read and accept the school rules and regulations.",
      de: "Ich habe die Schulordnung gelesen und akzeptiere die darin enthaltenen Regeln und Vorschriften.",
    },
    icon: "Gavel",
  },
  {
    id: "personenabbildung",
    key: "personenabbildung",
    enabled: true,
    required: true,
    order: 3,
    labels: {
      en: "Photo & Imaging Consent",
      de: "Einwilligung für Foto- und Bildaufnahmen",
    },
    description: {
      en: "I consent to having my photo taken for school purposes (ID card, yearbook, website).",
      de: "Ich willige ein, dass Fotos von mir für schulische Zwecke (Schülerausweis, Jahrbuch, Website) gemacht werden dürfen.",
    },
    icon: "CameraAlt",
  },
  {
    id: "teamsnutzung",
    key: "teamsnutzung",
    enabled: true,
    required: true,
    order: 4,
    labels: {
      en: "Microsoft Teams Usage Agreement",
      de: "Microsoft Teams Nutzungsvereinbarung",
    },
    description: {
      en: "I agree to use Microsoft Teams for school-related communication and activities.",
      de: "Ich verpflichte mich, Microsoft Teams für schulbezogene Kommunikation und Aktivitäten zu nutzen.",
    },
    icon: "Groups",
  },
];

/**
 * GET /api/settings/agreements
 * Fetches agreement settings with automatic migration from old schema
 */
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get or create settings document
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let settings = (await AppSettings.findOne().lean()) as any;

    if (!settings) {
      logger.info(
        "No settings found, creating default settings with agreements",
      );
      const defaultSettings = new AppSettings({
        agreements: { agreements: DEFAULT_AGREEMENTS },
      });
      settings = await defaultSettings.save();
    }

    // Auto-migration: If agreements array is empty but old boolean flags exist, migrate
    if (
      settings &&
      settings.agreements &&
      (!settings.agreements.agreements ||
        settings.agreements.agreements.length === 0)
    ) {
      logger.info(
        "Migrating old agreement boolean flags to new array structure",
      );

      // Create settings document if it doesn't exist
      const settingsDoc = await AppSettings.findOne();
      if (settingsDoc && settingsDoc.agreements) {
        settingsDoc.agreements.agreements = DEFAULT_AGREEMENTS;
        await settingsDoc.save();

        // Fetch updated settings
        settings = await AppSettings.findOne().lean();

        // Log migration
        logger.info(
          `Migrated ${DEFAULT_AGREEMENTS.length} agreements to new structure`,
        );
      }
    }

    logger.info("Agreement settings fetched successfully");

    return NextResponse.json(
      {
        success: true,
        data: settings?.agreements || { agreements: [] },
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to fetch agreement settings", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch agreement settings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/settings/agreements
 * Updates agreement settings
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

    if (!body || !body.agreements || typeof body.agreements !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body. Expected { agreements: {...} }",
        },
        { status: 400 },
      );
    }

    // Validate agreements array
    if (
      body.agreements.agreements &&
      Array.isArray(body.agreements.agreements)
    ) {
      const agreements = body.agreements.agreements;

      // Validate each agreement has required fields
      for (const agreement of agreements) {
        if (
          !agreement.id ||
          !agreement.key ||
          !agreement.labels ||
          !agreement.labels.en ||
          !agreement.labels.de
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Each agreement must have id, key, and labels (en, de) fields",
            },
            { status: 400 },
          );
        }
      }
    }

    // Get or create settings document
    let settings = await AppSettings.findOne();
    const oldAgreementSettings = settings?.agreements;

    if (!settings) {
      logger.info(
        "No settings found, creating new settings document with agreements",
      );
      settings = new AppSettings({ agreements: body.agreements });
    } else {
      // Update agreements
      if (!settings.agreements) {
        settings.agreements = body.agreements;
      } else {
        // Update individual agreement properties
        Object.keys(body.agreements).forEach((key) => {
          if (settings.agreements) {
            (settings.agreements as Record<string, unknown>)[key] =
              body.agreements[key];
          }
        });

        settings.markModified("agreements");
      }
    }

    await settings.save();

    // Log audit entry
    await createAuditLog(
      {
        action: "settings.update_agreements",
        category: "settings",
        description: tServer("audit.descriptions.updatedAgreementSettings"),
        status: "success",
        metadata: {
          settingCategory: "agreements",
          oldValues: oldAgreementSettings,
          newValues: body.agreements,
          agreementsCount: body.agreements.agreements?.length || 0,
        },
      },
      request,
    );

    logger.info("Agreement settings updated successfully");

    return NextResponse.json(
      {
        success: true,
        data: settings.agreements,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to update agreement settings", error);

    // Log audit entry for failure
    await createAuditLog(
      {
        action: "settings.update_agreements",
        category: "settings",
        description: tServer(
          "audit.descriptions.failedUpdateAgreementSettings",
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
        error: "Failed to update agreement settings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
