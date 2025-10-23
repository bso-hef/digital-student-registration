import { dbConnect, getMongoState } from "@/lib/config/mongo";
import { formatBytes } from "@/server/utils/server.utils";
import os from "os";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
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

  const report = {
    status: (Object.values(checks) as { status: string }[]).every(
      (c) => c.status === "up",
    )
      ? "up"
      : "down",
    checks,
    meta: {
      service: "digital-student-onboarding",
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
      now: new Date().toISOString(),
      uptimeSec: Math.floor(process.uptime()),
      node: process.version,
      system: {
        hostname: os.hostname(),
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
