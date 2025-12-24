import { auth } from "@/lib/auth/auth";
import { appConfig } from "@/lib/config/app-config";
import { dbConnect, getMongoState } from "@/lib/config/mongo";
import { isRedisAvailable } from "@/lib/redis";
import { formatBytes } from "@/server/utils/server.utils";
import os from "os";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // Check authentication - full health endpoint contains sensitive system info
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const checks: Record<string, unknown> = {};

  try {
    await dbConnect();
    const mongo = getMongoState();
    checks.mongo = { status: mongo.code === 1 ? "up" : "down", info: mongo };
  } catch (err: unknown) {
    checks.mongo = {
      status: "down",
      error: err instanceof Error ? err.message : "mongo failed",
    };
  }

  try {
    const redisUp = await isRedisAvailable();
    checks.redis = { status: redisUp ? "up" : "down" };
  } catch (err: unknown) {
    checks.redis = {
      status: "down",
      error: err instanceof Error ? err.message : "redis failed",
    };
  }

  // Determine critical checks based on environment
  const isDevelopment = appConfig.env.isDevelopment;

  // In development: Only MongoDB is critical (Redis is optional)
  // In production: Both MongoDB and Redis are critical
  const criticalChecks = isDevelopment ? ["mongo"] : ["mongo", "redis"];

  const allCriticalChecksUp = criticalChecks.every(
    (checkName) =>
      checks[checkName] &&
      (checks[checkName] as { status: string }).status === "up",
  );

  const report = {
    status: allCriticalChecksUp ? "up" : "down",
    checks,
    meta: {
      service: "digital-student-onboarding",
      version: appConfig.app.version,
      environment: isDevelopment ? "development" : "production",
      now: new Date().toISOString(),
      uptimeSec: Math.floor(process.uptime()),
      node: process.version,
      system: {
        hostname: appConfig.app.hostname,
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus()?.length,
        loadavg: os.loadavg(),
        freemem: formatBytes(os.freemem()),
        totalmem: formatBytes(os.totalmem()),
      },
    },
  };

  const statusCode = report.status === "up" ? 200 : 503;
  return new Response(JSON.stringify(report), {
    status: statusCode,
    headers: { "content-type": "application/json" },
  });
}
