import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const configuredUrl =
    process.env.QR_CODE_BASE_URL || process.env.NEXTAUTH_URL;

  if (!configuredUrl) {
    return NextResponse.json(
      { error: "QR_CODE_BASE_URL is not configured" },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  try {
    const appUrl = new URL(configuredUrl);

    if (appUrl.protocol !== "http:" && appUrl.protocol !== "https:") {
      throw new Error("Unsupported URL protocol");
    }

    return NextResponse.json(
      { appUrl: appUrl.toString().replace(/\/+$/, "") },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "QR_CODE_BASE_URL must be a valid HTTP(S) URL" },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
