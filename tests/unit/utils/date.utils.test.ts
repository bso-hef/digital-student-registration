import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import {
  formatGermanDate,
  formatISODate,
  isValidGermanDate,
  parseDate,
} from "@/utils/date.utils";

/**
 * Tests for date utility functions
 * @file tests/unit/utils/date.utils.test.ts
 */

describe("date.utils", () => {
  describe("parseDate", () => {
    it("should parse German format (DD.MM.YYYY)", () => {
      const result = parseDate("12.04.2002");
      expect(result).not.toBeNull();
      expect(result?.getDate()).toBe(12);
      expect(result?.getMonth()).toBe(3); // April is month 3 (0-indexed)
      expect(result?.getFullYear()).toBe(2002);
    });

    it("should parse ISO format (YYYY-MM-DD)", () => {
      const result = parseDate("2002-04-12");
      expect(result).not.toBeNull();
      expect(result?.getDate()).toBe(12);
      expect(result?.getMonth()).toBe(3);
      expect(result?.getFullYear()).toBe(2002);
    });

    it("should parse full ISO datetime string", () => {
      const result = parseDate("2002-04-12T10:30:00.000Z");
      expect(result).not.toBeNull();
      expect(result?.getFullYear()).toBe(2002);
      expect(result?.getMonth()).toBe(3);
      expect(result?.getDate()).toBe(12);
    });

    it("should parse Date objects", () => {
      const date = new Date(2002, 3, 12);
      const result = parseDate(date);
      expect(result).not.toBeNull();
      expect(result?.getDate()).toBe(12);
      expect(result?.getMonth()).toBe(3);
      expect(result?.getFullYear()).toBe(2002);
    });

    it("should parse Dayjs objects", () => {
      const dayjsObj = dayjs("2002-04-12");
      const result = parseDate(dayjsObj);
      expect(result).not.toBeNull();
      expect(result?.getDate()).toBe(12);
      expect(result?.getMonth()).toBe(3);
      expect(result?.getFullYear()).toBe(2002);
    });

    it("should return null for invalid Dayjs objects", () => {
      const invalidDayjsObj = dayjs("invalid");
      expect(invalidDayjsObj.isValid()).toBe(false);
      const result = parseDate(invalidDayjsObj);
      expect(result).toBeNull();
    });

    it("should return null for non-string non-date types", () => {
      expect(parseDate(12345)).toBeNull();
      expect(parseDate({})).toBeNull();
      expect(parseDate([])).toBeNull();
      expect(parseDate(true)).toBeNull();
    });

    it("should return null for null input", () => {
      expect(parseDate(null)).toBeNull();
    });

    it("should return null for undefined input", () => {
      expect(parseDate(undefined)).toBeNull();
    });

    it("should return null for empty string", () => {
      expect(parseDate("")).toBeNull();
    });

    it("should return null for invalid date strings", () => {
      expect(parseDate("invalid")).toBeNull();
      expect(parseDate("abc.def.ghij")).toBeNull();
    });

    it("should return null for invalid Date objects", () => {
      const invalidDate = new Date("invalid");
      expect(parseDate(invalidDate)).toBeNull();
    });

    it("should handle edge case dates", () => {
      // Leap year
      const leapYear = parseDate("29.02.2024");
      expect(leapYear).not.toBeNull();
      expect(leapYear?.getDate()).toBe(29);
      expect(leapYear?.getMonth()).toBe(1);

      // End of year
      const endOfYear = parseDate("31.12.2023");
      expect(endOfYear).not.toBeNull();
      expect(endOfYear?.getDate()).toBe(31);
      expect(endOfYear?.getMonth()).toBe(11);
    });
  });

  describe("formatGermanDate", () => {
    it("should format Date object to German format", () => {
      const date = new Date(2002, 3, 12);
      expect(formatGermanDate(date)).toBe("12.04.2002");
    });

    it("should format ISO string to German format", () => {
      expect(formatGermanDate("2002-04-12")).toBe("12.04.2002");
    });

    it("should format German string to German format (passthrough)", () => {
      expect(formatGermanDate("12.04.2002")).toBe("12.04.2002");
    });

    it("should return empty string for null", () => {
      expect(formatGermanDate(null)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(formatGermanDate(undefined)).toBe("");
    });

    it("should return empty string for invalid date", () => {
      expect(formatGermanDate("invalid")).toBe("");
    });

    it("should handle single digit days and months with leading zeros", () => {
      const date = new Date(2002, 0, 5); // January 5, 2002
      expect(formatGermanDate(date)).toBe("05.01.2002");
    });
  });

  describe("formatISODate", () => {
    it("should format Date object to ISO format", () => {
      const date = new Date(2002, 3, 12);
      expect(formatISODate(date)).toBe("2002-04-12");
    });

    it("should format German string to ISO format", () => {
      expect(formatISODate("12.04.2002")).toBe("2002-04-12");
    });

    it("should format ISO string to ISO format (passthrough)", () => {
      expect(formatISODate("2002-04-12")).toBe("2002-04-12");
    });

    it("should return empty string for null", () => {
      expect(formatISODate(null)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(formatISODate(undefined)).toBe("");
    });

    it("should return empty string for invalid date", () => {
      expect(formatISODate("invalid")).toBe("");
    });
  });

  describe("isValidGermanDate", () => {
    it("should return true for valid German date format", () => {
      expect(isValidGermanDate("12.04.2002")).toBe(true);
      expect(isValidGermanDate("01.01.2000")).toBe(true);
      expect(isValidGermanDate("31.12.2023")).toBe(true);
    });

    it("should return false for ISO format", () => {
      expect(isValidGermanDate("2002-04-12")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isValidGermanDate("")).toBe(false);
    });

    it("should return false for invalid format", () => {
      expect(isValidGermanDate("12/04/2002")).toBe(false);
      expect(isValidGermanDate("04.12.02")).toBe(false);
      expect(isValidGermanDate("invalid")).toBe(false);
    });

    it("should return false for invalid date values", () => {
      expect(isValidGermanDate("32.04.2002")).toBe(false);
      expect(isValidGermanDate("12.13.2002")).toBe(false);
    });
  });
});
