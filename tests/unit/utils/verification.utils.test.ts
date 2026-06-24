import {
  generateUniqueVerificationCode,
  generateVerificationCode,
  isValidVerificationCode,
  normalizeVerificationCode,
} from "@/utils/verification.utils";
import { describe, expect, it, vi } from "vitest";

/**
 * Tests for verification utility functions
 * @file tests/unit/utils/verification.utils.test.ts
 */

describe("verification.utils", () => {
  describe("generateVerificationCode", () => {
    it("should generate a 6-character code", () => {
      const code = generateVerificationCode();
      expect(code).toHaveLength(6);
    });

    it("should only contain uppercase letters and numbers", () => {
      const code = generateVerificationCode();
      expect(code).toMatch(/^[0-9A-Z]{6}$/);
    });

    it("should generate different codes on multiple calls", () => {
      const codes = new Set<string>();
      for (let i = 0; i < 100; i++) {
        codes.add(generateVerificationCode());
      }
      // With 36^6 possibilities, 100 codes should all be unique
      expect(codes.size).toBeGreaterThan(90);
    });
  });

  describe("isValidVerificationCode", () => {
    it("should return true for valid 6-character alphanumeric codes", () => {
      expect(isValidVerificationCode("ABC123")).toBe(true);
      expect(isValidVerificationCode("000000")).toBe(true);
      expect(isValidVerificationCode("ZZZZZZ")).toBe(true);
      expect(isValidVerificationCode("A1B2C3")).toBe(true);
    });

    it("should return false for lowercase codes", () => {
      expect(isValidVerificationCode("abc123")).toBe(false);
      expect(isValidVerificationCode("Abc123")).toBe(false);
    });

    it("should return false for codes with wrong length", () => {
      expect(isValidVerificationCode("ABC12")).toBe(false);
      expect(isValidVerificationCode("ABC1234")).toBe(false);
      expect(isValidVerificationCode("")).toBe(false);
    });

    it("should return false for codes with special characters", () => {
      expect(isValidVerificationCode("ABC-12")).toBe(false);
      expect(isValidVerificationCode("ABC_12")).toBe(false);
      expect(isValidVerificationCode("ABC 12")).toBe(false);
    });

    it("should return false for null or undefined", () => {
      expect(isValidVerificationCode(null as unknown as string)).toBe(false);
      expect(isValidVerificationCode(undefined as unknown as string)).toBe(
        false,
      );
    });

    it("should return false for non-string values", () => {
      expect(isValidVerificationCode(123456 as unknown as string)).toBe(false);
    });
  });

  describe("normalizeVerificationCode", () => {
    it("should convert to uppercase", () => {
      expect(normalizeVerificationCode("abc123")).toBe("ABC123");
      expect(normalizeVerificationCode("AbC123")).toBe("ABC123");
    });

    it("should trim whitespace", () => {
      expect(normalizeVerificationCode(" ABC123 ")).toBe("ABC123");
      expect(normalizeVerificationCode("  ABC123")).toBe("ABC123");
      expect(normalizeVerificationCode("ABC123  ")).toBe("ABC123");
    });

    it("should handle already normalized codes", () => {
      expect(normalizeVerificationCode("ABC123")).toBe("ABC123");
    });
  });

  describe("generateUniqueVerificationCode", () => {
    it("should return a code that does not exist", async () => {
      const checkExists = vi.fn().mockResolvedValue(false);

      const code = await generateUniqueVerificationCode(checkExists);

      expect(code).toHaveLength(6);
      expect(code).toMatch(/^[0-9A-Z]{6}$/);
      expect(checkExists).toHaveBeenCalledTimes(1);
    });

    it("should retry if code already exists", async () => {
      const checkExists = vi
        .fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const code = await generateUniqueVerificationCode(checkExists);

      expect(code).toHaveLength(6);
      expect(checkExists).toHaveBeenCalledTimes(3);
    });

    it("should throw error after max attempts", async () => {
      const checkExists = vi.fn().mockResolvedValue(true);

      await expect(
        generateUniqueVerificationCode(checkExists, 5),
      ).rejects.toThrow(
        "Failed to generate unique verification code after 5 attempts",
      );

      expect(checkExists).toHaveBeenCalledTimes(5);
    });

    it("should respect custom maxAttempts", async () => {
      const checkExists = vi.fn().mockResolvedValue(true);

      await expect(
        generateUniqueVerificationCode(checkExists, 3),
      ).rejects.toThrow(
        "Failed to generate unique verification code after 3 attempts",
      );

      expect(checkExists).toHaveBeenCalledTimes(3);
    });

    it("should use default maxAttempts of 10", async () => {
      const checkExists = vi.fn().mockResolvedValue(true);

      await expect(generateUniqueVerificationCode(checkExists)).rejects.toThrow(
        "Failed to generate unique verification code after 10 attempts",
      );

      expect(checkExists).toHaveBeenCalledTimes(10);
    });
  });
});
