import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  generateWifiQrString,
  makeQrDataUrl,
  makeStudentQrDataUrl,
  makeWlanQrDataUrl,
} from "@/utils/qr.utils";

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

  describe("generateWifiQrString", () => {
    it("should generate WiFi QR string with WPA security", () => {
      const result = generateWifiQrString("MyNetwork", "password123", "WPA");
      expect(result).toBe("WIFI:T:WPA;S:MyNetwork;P:password123;H:false;;");
    });

    it("should generate WiFi QR string with WPA2 security", () => {
      const result = generateWifiQrString("MyNetwork", "password123", "WPA2");
      expect(result).toBe("WIFI:T:WPA;S:MyNetwork;P:password123;H:false;;");
    });

    it("should generate WiFi QR string with WPA3 security", () => {
      const result = generateWifiQrString("MyNetwork", "password123", "WPA3");
      expect(result).toBe("WIFI:T:WPA;S:MyNetwork;P:password123;H:false;;");
    });

    it("should generate WiFi QR string with WEP security", () => {
      const result = generateWifiQrString("MyNetwork", "password123", "WEP");
      expect(result).toBe("WIFI:T:WEP;S:MyNetwork;P:password123;H:false;;");
    });

    it("should generate WiFi QR string with nopass security", () => {
      const result = generateWifiQrString("OpenNetwork", "", "nopass");
      expect(result).toBe("WIFI:T:nopass;S:OpenNetwork;P:;H:false;;");
    });

    it("should default to WPA for unknown security types", () => {
      const result = generateWifiQrString("MyNetwork", "password123", "unknown");
      expect(result).toBe("WIFI:T:WPA;S:MyNetwork;P:password123;H:false;;");
    });

    it("should handle hidden network flag", () => {
      const result = generateWifiQrString(
        "HiddenNetwork",
        "password123",
        "WPA",
        true,
      );
      expect(result).toBe("WIFI:T:WPA;S:HiddenNetwork;P:password123;H:true;;");
    });

    it("should escape special characters in SSID", () => {
      const result = generateWifiQrString("My;Network", "password", "WPA");
      expect(result).toContain("My\\;Network");
    });

    it("should escape special characters in password", () => {
      const result = generateWifiQrString("Network", "pass;word", "WPA");
      expect(result).toContain("pass\\;word");
    });

    it("should escape backslash characters", () => {
      const result = generateWifiQrString("Net\\work", "pass\\word", "WPA");
      expect(result).toContain("Net\\\\work");
      expect(result).toContain("pass\\\\word");
    });

    it("should escape colon characters", () => {
      const result = generateWifiQrString("Net:work", "pass:word", "WPA");
      expect(result).toContain("Net\\:work");
      expect(result).toContain("pass\\:word");
    });

    it("should escape comma characters", () => {
      const result = generateWifiQrString("Net,work", "pass,word", "WPA");
      expect(result).toContain("Net\\,work");
      expect(result).toContain("pass\\,word");
    });
  });

  describe("makeWlanQrDataUrl", () => {
    // Mock document as undefined to test server-side path
    // (jsdom Image.onload doesn't fire properly for data URLs)
    const originalDocument = global.document;

    beforeEach(() => {
      // @ts-expect-error - mocking document as undefined for server-side path
      delete global.document;
    });

    afterEach(() => {
      global.document = originalDocument;
    });

    it("should generate WiFi QR code data URL", async () => {
      const result = await makeWlanQrDataUrl(
        "TestNetwork",
        "password123",
        "WPA",
      );
      expect(result).toContain("data:image/png;base64");
    });

    it("should handle hidden network parameter", async () => {
      const result = await makeWlanQrDataUrl(
        "TestNetwork",
        "password123",
        "WPA",
        true,
      );
      expect(result).toContain("data:image/png;base64");
    });

    it("should handle different security types", async () => {
      const wpaResult = await makeWlanQrDataUrl(
        "Network",
        "pass",
        "WPA",
      );
      const wepResult = await makeWlanQrDataUrl(
        "Network",
        "pass",
        "WEP",
      );
      expect(wpaResult).toContain("data:image/png;base64");
      expect(wepResult).toContain("data:image/png;base64");
    });
  });

  describe("makeStudentQrDataUrl", () => {
    // Mock document as undefined to test server-side path
    // (jsdom Image.onload doesn't fire properly for data URLs)
    const originalDocument = global.document;

    beforeEach(() => {
      // @ts-expect-error - mocking document as undefined for server-side path
      delete global.document;
    });

    afterEach(() => {
      global.document = originalDocument;
    });

    it("should generate student QR code data URL", async () => {
      const result = await makeStudentQrDataUrl("https://example.com/student/123");
      expect(result).toContain("data:image/png;base64");
    });

    it("should handle empty text", async () => {
      const result = await makeStudentQrDataUrl("");
      expect(result).toContain("data:image/png;base64");
    });

    it("should handle special characters in URL", async () => {
      const result = await makeStudentQrDataUrl(
        "https://example.com/student/abc-123?token=xyz",
      );
      expect(result).toContain("data:image/png;base64");
    });
  });
});
