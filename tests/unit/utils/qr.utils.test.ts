import { describe, expect, it, vi } from "vitest";

import { makeQrDataUrl } from "@/utils/qr.utils";

/**
 * Tests for QR code utility functions
 * @file tests/unit/utils/qr.utils.test.ts
 */

// Mock QRCode module
vi.mock("qrcode", () => ({
  default: {
    toDataURL: vi.fn((text: string) =>
      Promise.resolve(`data:image/png;base64,mock-qr-${text}`),
    ),
  },
}));

describe("qr.utils", () => {
  describe("makeQrDataUrl", () => {
    it("should generate QR code data URL from text", async () => {
      const result = await makeQrDataUrl("test-text");
      expect(result).toBe("data:image/png;base64,mock-qr-test-text");
    });

    it("should handle empty string", async () => {
      const result = await makeQrDataUrl("");
      expect(result).toBe("data:image/png;base64,mock-qr-");
    });

    it("should handle URLs", async () => {
      const url = "https://example.com/verify/123";
      const result = await makeQrDataUrl(url);
      expect(result).toContain("mock-qr-");
    });

    it("should handle special characters", async () => {
      const result = await makeQrDataUrl("test@#$%^&*()");
      expect(result).toContain("data:image/png;base64");
    });

    it("should handle long strings", async () => {
      const longText = "a".repeat(1000);
      const result = await makeQrDataUrl(longText);
      expect(result).toContain("data:image/png;base64");
    });
  });
});
