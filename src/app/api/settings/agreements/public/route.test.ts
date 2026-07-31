import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const mocks = vi.hoisted(() => ({
  dbConnect: vi.fn(),
  getClientIp: vi.fn(),
  rateLimit: vi.fn(),
  lean: vi.fn(),
  select: vi.fn(),
  findOne: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock("@/lib/config/mongo", () => ({
  dbConnect: mocks.dbConnect,
}));

vi.mock("@/lib/rate-limit", () => ({
  getClientIp: mocks.getClientIp,
  rateLimit: mocks.rateLimit,
}));

vi.mock("@/lib/server-logger", () => ({
  default: class Logger {
    error = mocks.loggerError;
  },
}));

vi.mock("@/models/AppSettings", () => ({
  default: {
    findOne: mocks.findOne,
  },
}));

describe("GET /api/settings/agreements/public", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getClientIp.mockReturnValue("192.0.2.10");
    mocks.rateLimit.mockResolvedValue({
      allowed: true,
      remaining: 19,
      limit: 20,
    });
    mocks.findOne.mockReturnValue({ select: mocks.select });
    mocks.select.mockReturnValue({ lean: mocks.lean });
  });

  it("returns only enabled agreements in their configured order", async () => {
    mocks.lean.mockResolvedValue({
      agreements: {
        agreements: [
          {
            id: "disabled",
            key: "disabled",
            enabled: false,
            required: false,
            order: 0,
            labels: { en: "Disabled", de: "Deaktiviert" },
            description: { en: "", de: "" },
          },
          {
            id: "second",
            key: "second",
            enabled: true,
            required: false,
            order: 2,
            labels: { en: "Second", de: "Zweite" },
            description: { en: "", de: "" },
          },
          {
            id: "first",
            key: "first",
            enabled: true,
            required: true,
            order: 1,
            labels: { en: "First", de: "Erste" },
            description: { en: "", de: "" },
          },
        ],
      },
    });

    const response = await GET(
      new NextRequest("http://localhost/api/settings/agreements/public"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data.agreements.map(({ id }: { id: string }) => id)).toEqual([
      "first",
      "second",
    ]);
    expect(mocks.rateLimit).toHaveBeenCalledWith(
      "settings:agreements:public:192.0.2.10",
      20,
      60,
    );
  });

  it("rejects requests after the per-IP limit is exceeded", async () => {
    mocks.rateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      limit: 20,
    });

    const response = await GET(
      new NextRequest("http://localhost/api/settings/agreements/public"),
    );

    expect(response.status).toBe(429);
    expect(mocks.dbConnect).not.toHaveBeenCalled();
    expect(mocks.findOne).not.toHaveBeenCalled();
  });

  it("returns an empty list when no settings exist", async () => {
    mocks.lean.mockResolvedValue(null);

    const response = await GET(
      new NextRequest("http://localhost/api/settings/agreements/public"),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { agreements: [] },
    });
  });
});
