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
  default: class AppSettings {
    static findOne = mocks.findOne;

    toObject() {
      return { onboarding: { fieldConfigs: {}, genderOptions: [] } };
    }
  },
}));

describe("GET /api/settings/onboarding/public", () => {
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

  it("returns only onboarding settings and applies the per-IP rate limit", async () => {
    const onboarding = {
      genderOptions: [
        { value: "diverse", label: "Diverse", enabled: true, order: 0 },
      ],
      fieldConfigs: {
        geschlecht: { required: true, visible: true, allowCustom: false },
        telefon1: { required: false, visible: true, allowCustom: false },
        vorhergehendeSchulform: {
          required: true,
          visible: true,
          allowCustom: false,
        },
      },
    };
    mocks.lean.mockResolvedValue({ onboarding });

    const response = await GET(
      new NextRequest("http://localhost/api/settings/onboarding/public"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { onboarding },
    });
    expect(mocks.select).toHaveBeenCalledWith("onboarding");
    expect(mocks.rateLimit).toHaveBeenCalledWith(
      "settings:onboarding:public:192.0.2.10",
      20,
      60,
    );
  });

  it("rejects requests after 20 requests per minute", async () => {
    mocks.rateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      limit: 20,
    });

    const response = await GET(
      new NextRequest("http://localhost/api/settings/onboarding/public"),
    );

    expect(response.status).toBe(429);
    expect(mocks.dbConnect).not.toHaveBeenCalled();
    expect(mocks.findOne).not.toHaveBeenCalled();
  });

  it("uses default onboarding settings when no document exists", async () => {
    mocks.lean.mockResolvedValue(null);

    const response = await GET(
      new NextRequest("http://localhost/api/settings/onboarding/public"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.onboarding).toEqual({
      fieldConfigs: {
        telefon1: {
          required: false,
          visible: true,
          allowCustom: false,
        },
        vorhergehendeSchulform: {
          required: true,
          visible: true,
          allowCustom: true,
        },
      },
      genderOptions: [],
    });
  });
});
