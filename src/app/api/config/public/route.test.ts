import { afterEach, describe, expect, it } from "vitest";

import { GET } from "./route";

const originalQrCodeBaseUrl = process.env.QR_CODE_BASE_URL;
const originalNextAuthUrl = process.env.NEXTAUTH_URL;

afterEach(() => {
  if (originalQrCodeBaseUrl === undefined) {
    delete process.env.QR_CODE_BASE_URL;
  } else {
    process.env.QR_CODE_BASE_URL = originalQrCodeBaseUrl;
  }

  if (originalNextAuthUrl === undefined) {
    delete process.env.NEXTAUTH_URL;
  } else {
    process.env.NEXTAUTH_URL = originalNextAuthUrl;
  }
});

describe("GET /api/config/public", () => {
  it("returns the runtime QR code base URL without a trailing path", async () => {
    process.env.QR_CODE_BASE_URL =
      "https://registration.example.org/configured-path";

    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      appUrl: "https://registration.example.org/configured-path",
    });
  });

  it("falls back to NEXTAUTH_URL", async () => {
    process.env.QR_CODE_BASE_URL = "";
    process.env.NEXTAUTH_URL = "https://fallback.example.org";

    const response = GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      appUrl: "https://fallback.example.org",
    });
  });

  it("rejects an invalid URL", async () => {
    process.env.QR_CODE_BASE_URL = "not-a-url";

    const response = GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "QR_CODE_BASE_URL must be a valid HTTP(S) URL",
    });
  });
});
