import { dbConnect } from "@/lib/config/mongo";
import Logger from "@/lib/server-logger";
import AuditLog from "@/models/AuditLog";
import { NextRequest } from "next/server";

import AppSettings from "@/models/AppSettings";

const logger = new Logger("AuditMiddleware");

export interface AuditLogData {
  action: string;
  category: "student" | "class" | "settings" | "auth" | "system";
  description: string;
  status: "success" | "failure" | "partial";
  metadata?: Record<string, unknown>;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export async function createAuditLog(
  data: AuditLogData,
  request?: NextRequest,
): Promise<void> {
  try {
    await dbConnect();

    type AppSettingsType = {
      audit?: {
        logStudentChanges?: boolean;
        logClassChanges?: boolean;
        logSettingsChanges?: boolean;
      };
    };

    let settings: AppSettingsType | null = null;
    try {
      const result = await (
        AppSettings as { findOne: () => Promise<AppSettingsType | null> }
      ).findOne();
      settings = result;
    } catch (error) {
      logger.warn("Could not fetch settings, using defaults", error);
    }

    const auditSettings = settings?.audit;

    const logStudentChanges = auditSettings?.logStudentChanges ?? true;
    const logClassChanges = auditSettings?.logClassChanges ?? true;
    const logSettingsChanges = auditSettings?.logSettingsChanges ?? true;

    if (data.category === "student" && !logStudentChanges) {
      logger.info("Student audit logging is disabled, skipping log creation");
      return;
    }
    if (data.category === "class" && !logClassChanges) {
      logger.info("Class audit logging is disabled, skipping log creation");
      return;
    }
    if (data.category === "settings" && !logSettingsChanges) {
      logger.info("Settings audit logging is disabled, skipping log creation");
      return;
    }

    let ipAddress = "unknown";
    let userAgent = "unknown";

    if (request) {
      ipAddress =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
      userAgent = request.headers.get("user-agent") || "unknown";
    }

    const logEntry = {
      action: data.action,
      category: data.category,
      description: data.description,
      status: data.status,
      metadata: data.metadata || {},
      ipAddress,
      userAgent,
      userId: data.userId || "system",
      userName: data.userName || "System",
      userEmail: data.userEmail,
      timestamp: new Date(),
    };

    const createdLog = new AuditLog(logEntry);
    await createdLog.save();

    logger.info(`Audit log created: ${data.action}`, {
      category: data.category,
      status: data.status,
    });
  } catch (error) {
    logger.error("Failed to create audit log", {
      error: error instanceof Error ? error.message : String(error),
      action: data.action,
      category: data.category,
    });
  }
}
