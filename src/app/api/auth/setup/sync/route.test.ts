import { isSystemSetup } from "@/lib/auth/auth";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

vi.mock("@/lib/auth/auth", () => ({
  isSystemSetup: vi.fn(),
}));

vi.mock("@/lib/config/app-config", () => ({
  appConfig: {
    app: { url: "https://registration.example.org" },
  },
}));

const mockedIsSystemSetup = vi.mocked(isSystemSetup);

beforeEach(() => {
  mockedIsSystemSetup.mockReset();
});

describe("GET /api/auth/setup/sync", () => {
  it("sets the setup cookie and returns a fresh browser to its target", async () => {
    mockedIsSystemSetup.mockResolvedValue(true);
    const request = new NextRequest(
      "https://registration.example.org/api/auth/setup/sync?redirect=%2Fstudent%2Fnew",
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://registration.example.org/student/new",
    );
    expect(response.cookies.get("setup-complete")?.value).toBe("true");
  });

  it("continues to setup when the database setup is incomplete", async () => {
    mockedIsSystemSetup.mockResolvedValue(false);
    const request = new NextRequest(
      "https://registration.example.org/api/auth/setup/sync?redirect=%2Fstudent%2Fnew",
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://registration.example.org/setup",
    );
    expect(response.cookies.get("setup-complete")).toBeUndefined();
  });
});
