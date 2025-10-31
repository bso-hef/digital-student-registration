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
 * Default agreements with multilingual labels
 * Based on original boolean flags from AppSettings schema:
 * - privacyPolicyEnabled (default: false)
 * - termsOfServiceEnabled (default: false)
 * - parentalConsentEnabled (default: true)
 * - dataProcessingAgreementEnabled (default: false)
 */
const DEFAULT_AGREEMENTS = [
  {
    id: "privacy_policy",
    key: "privacy_policy",
    enabled: false,
    required: false,
    order: 0,
    labels: {
      en: "Privacy Policy",
      de: "Datenschutzerklärung",
    },
  },
  {
    id: "terms_of_service",
    key: "terms_of_service",
    enabled: false,
    required: false,
    order: 1,
    labels: {
      en: "Terms of Service",
      de: "Nutzungsbedingungen",
    },
  },
  {
    id: "parental_consent",
    key: "parental_consent",
    enabled: true,
    required: true,
    order: 2,
    labels: {
      en: "Parental Consent",
      de: "Einverständniserklärung der Eltern",
    },
  },
  {
    id: "data_processing_agreement",
    key: "data_processing_agreement",
    enabled: false,
    required: false,
    order: 3,
    labels: {
      en: "Data Processing Agreement",
      de: "Datenverarbeitungsvereinbarung",
    },
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
    let settings: any = await AppSettings.findOne().lean();

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
