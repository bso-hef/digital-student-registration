import { deburr, isISODate, isoDateToUTC, norm } from "@/lib/config/norm";
import { describe, expect, it } from "vitest";

/**
 * Tests for normalization and date utility functions
 * @file tests/unit/lib/config/norm.test.ts
 */

describe("norm.ts", () => {
  describe("deburr", () => {
    it("should remove diacritics from string", () => {
      expect(deburr("café")).toBe("cafe");
      expect(deburr("naïve")).toBe("naive");
      expect(deburr("résumé")).toBe("resume");
    });

    it("should handle German umlauts", () => {
      expect(deburr("Müller")).toBe("Muller");
      expect(deburr("Schön")).toBe("Schon");
      // ß (Eszett) doesn't get converted by Unicode normalization
      expect(deburr("Größe")).toBe("Große");
    });

    it("should handle French accents", () => {
      expect(deburr("François")).toBe("Francois");
      expect(deburr("Crème brûlée")).toBe("Creme brulee");
    });

    it("should handle Spanish characters", () => {
      expect(deburr("Peña")).toBe("Pena");
      expect(deburr("José")).toBe("Jose");
    });

    it("should handle strings without diacritics", () => {
      expect(deburr("hello")).toBe("hello");
      expect(deburr("test123")).toBe("test123");
    });

    it("should handle empty string", () => {
      expect(deburr("")).toBe("");
    });
  });

  describe("norm", () => {
    it("should normalize string by removing diacritics, trimming, lowercasing", () => {
      expect(norm("  Café  ")).toBe("cafe");
      expect(norm("MÜLLER")).toBe("muller");
    });

    it("should collapse multiple spaces into single space", () => {
      expect(norm("hello    world")).toBe("hello world");
      expect(norm("  multiple   spaces   ")).toBe("multiple spaces");
    });

    it("should trim leading and trailing whitespace", () => {
      expect(norm("  test  ")).toBe("test");
      expect(norm("\t\ntest\n\t")).toBe("test");
    });

    it("should convert to lowercase", () => {
      expect(norm("UPPERCASE")).toBe("uppercase");
      expect(norm("MiXeD CaSe")).toBe("mixed case");
    });

    it("should handle empty string", () => {
      expect(norm("")).toBe("");
    });

    it("should handle null and undefined as empty string", () => {
      expect(norm(null as unknown as string)).toBe("");
      expect(norm(undefined as unknown as string)).toBe("");
    });

    it("should handle numbers by converting to string", () => {
      expect(norm(123 as unknown as string)).toBe("123");
      // 0 is falsy so it returns empty string
      expect(norm(0 as unknown as string)).toBe("");
    });

    it("should normalize names for comparison", () => {
      expect(norm("José García")).toBe("jose garcia");
      expect(norm("François Müller")).toBe("francois muller");
    });
  });

  describe("isISODate", () => {
    it("should return true for valid ISO date strings", () => {
      expect(isISODate("2024-01-15")).toBe(true);
      expect(isISODate("2023-12-31")).toBe(true);
      expect(isISODate("2000-01-01")).toBe(true);
    });

    it("should return false for invalid ISO date strings", () => {
      expect(isISODate("2024-1-15")).toBe(false);
      expect(isISODate("24-01-15")).toBe(false);
      expect(isISODate("2024/01/15")).toBe(false);
    });

    it("should return false for non-date strings", () => {
      expect(isISODate("not a date")).toBe(false);
      expect(isISODate("")).toBe(false);
      expect(isISODate("2024-13-45")).toBe(true); // Pattern matches, doesn't validate date
    });

    it("should return false for datetime strings", () => {
      expect(isISODate("2024-01-15T10:30:00")).toBe(false);
      expect(isISODate("2024-01-15 10:30:00")).toBe(false);
    });

    it("should handle edge cases", () => {
      expect(isISODate("0000-00-00")).toBe(true); // Pattern matches
      expect(isISODate("9999-99-99")).toBe(true); // Pattern matches
    });
  });

  describe("isoDateToUTC", () => {
    it("should convert ISO date string to UTC Date object", () => {
      const result = isoDateToUTC("2024-01-15");
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe("2024-01-15T00:00:00.000Z");
    });

    it("should handle different dates", () => {
      expect(isoDateToUTC("2023-12-31").toISOString()).toBe(
        "2023-12-31T00:00:00.000Z",
      );
      expect(isoDateToUTC("2000-01-01").toISOString()).toBe(
        "2000-01-01T00:00:00.000Z",
      );
    });

    it("should always set time to midnight UTC", () => {
      const result = isoDateToUTC("2024-06-15");
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
      expect(result.getUTCMilliseconds()).toBe(0);
    });

    it("should handle leap year dates", () => {
      const result = isoDateToUTC("2024-02-29");
      expect(result.toISOString()).toBe("2024-02-29T00:00:00.000Z");
    });

    it("should handle year boundaries", () => {
      expect(isoDateToUTC("2023-12-31").getUTCFullYear()).toBe(2023);
      expect(isoDateToUTC("2024-01-01").getUTCFullYear()).toBe(2024);
    });
  });
});
