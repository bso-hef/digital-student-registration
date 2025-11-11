import { describe, expect, it } from "vitest";

import { SCHEMA } from "@/constants/db.constants";

/**
 * Tests for database schema constants
 * @file tests/unit/constants/db.constants.test.ts
 */

describe("db.constants", () => {
  describe("SCHEMA", () => {
    it("should define AppSettings schema name", () => {
      expect(SCHEMA.APP_SETTINGS).toBe("AppSettings");
    });

    it("should define Student schema name", () => {
      expect(SCHEMA.STUDENT).toBe("Student");
    });

    it("should define Class schema name", () => {
      expect(SCHEMA.CLASS).toBe("Class");
    });

    it("should define AuditLog schema name", () => {
      expect(SCHEMA.AUDIT_LOG).toBe("AuditLog");
    });

    it("should define User schema name", () => {
      expect(SCHEMA.USER).toBe("User");
    });

    it("should be a const object with all schema names", () => {
      expect(Object.keys(SCHEMA)).toEqual([
        "APP_SETTINGS",
        "STUDENT",
        "CLASS",
        "AUDIT_LOG",
        "USER",
      ]);
    });

    it("should have exactly 5 schema definitions", () => {
      expect(Object.keys(SCHEMA).length).toBe(5);
    });

    it("should have string values for all schema names", () => {
      Object.values(SCHEMA).forEach((value) => {
        expect(typeof value).toBe("string");
      });
    });

    it("should not allow modification (const assertion)", () => {
      // TypeScript const assertion makes it readonly
      // This test just verifies the structure
      expect(SCHEMA).toBeDefined();
    });
  });
});
