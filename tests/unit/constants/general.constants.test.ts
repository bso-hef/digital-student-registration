import { describe, expect, it } from "vitest";

import {
  COLORS,
  CONTEXT_PATH,
  LANGUAGES,
  NO_AVATAR_FOUND,
  STUDENT_STATUS,
  THEME,
  WIZZARD_URL,
} from "@/constants/general.constants";

/**
 * Tests for general constants
 * @file tests/unit/constants/general.constants.test.ts
 */

describe("general.constants", () => {
  describe("THEME", () => {
    it("should define DARK theme", () => {
      expect(THEME.DARK).toBe("dark");
    });

    it("should define LIGHT theme", () => {
      expect(THEME.LIGHT).toBe("light");
    });

    it("should define AUTO theme", () => {
      expect(THEME.AUTO).toBe("auto");
    });

    it("should have exactly 3 theme modes", () => {
      expect(Object.keys(THEME).length).toBe(3);
    });
  });

  describe("COLORS", () => {
    it("should define WHITE color", () => {
      expect(COLORS.WHITE).toBe("#ffffff");
    });

    it("should define BLACK color", () => {
      expect(COLORS.BLACK).toBe("#000000");
    });

    it("should define accent color", () => {
      expect(COLORS.ACCENT_COLOR).toBe("#2b6e4a");
    });

    it("should define semantic colors", () => {
      expect(COLORS.SUCCESS).toBe("#4CAF50");
      expect(COLORS.INFO).toBe("#2196F3");
      expect(COLORS.ERROR).toBe("#F44336");
      expect(COLORS.WARNING).toBe("#FFC107");
    });

    it("should define material colors", () => {
      expect(COLORS.RED).toBe("#EE3426");
      expect(COLORS.PINK).toBe("#E91E63");
      expect(COLORS.PURPLE).toBe("#9C27B0");
      expect(COLORS.INDIGO).toBe("#3F51B5");
      expect(COLORS.CYAN).toBe("#00BCD4");
      expect(COLORS.TEAL).toBe("#009688");
      expect(COLORS.GREEN).toBe("#37AC28");
    });

    it("should all colors be valid hex codes", () => {
      const hexRegex = /^#[0-9A-F]{6}$/i;
      Object.values(COLORS).forEach((color) => {
        expect(hexRegex.test(color)).toBe(true);
      });
    });

    it("should have at least 23 colors defined", () => {
      expect(Object.keys(COLORS).length).toBeGreaterThanOrEqual(23);
    });
  });

  describe("LANGUAGES", () => {
    it("should define ENGLISH language", () => {
      expect(LANGUAGES.ENGLISH).toEqual({
        isoCode: "en",
        value: "English",
        key: "en",
      });
    });

    it("should define GERMAN language", () => {
      expect(LANGUAGES.GERMAN).toEqual({
        isoCode: "de",
        value: "German",
        key: "de-DE",
      });
    });

    it("should have exactly 2 languages", () => {
      expect(Object.keys(LANGUAGES).length).toBe(2);
    });

    it("should have valid ISO codes", () => {
      expect(LANGUAGES.ENGLISH.isoCode).toBe("en");
      expect(LANGUAGES.GERMAN.isoCode).toBe("de");
    });

    it("should have keys for language selection", () => {
      expect(LANGUAGES.ENGLISH.key).toBe("en");
      expect(LANGUAGES.GERMAN.key).toBe("de-DE");
    });
  });

  describe("CONTEXT_PATH", () => {
    it("should be defined as a string", () => {
      expect(typeof CONTEXT_PATH).toBe("string");
    });

    it("should be empty or a valid URL", () => {
      if (CONTEXT_PATH) {
        expect(
          CONTEXT_PATH.startsWith("http") || CONTEXT_PATH.startsWith("/"),
        ).toBe(true);
      } else {
        expect(CONTEXT_PATH).toBe("");
      }
    });
  });

  describe("NO_AVATAR_FOUND", () => {
    it("should define avatar placeholder path", () => {
      expect(NO_AVATAR_FOUND).toBe("/images/no-avatar-found.png");
    });

    it("should be a valid image path", () => {
      expect(NO_AVATAR_FOUND).toMatch(/\.(png|jpg|jpeg|gif|svg)$/i);
    });

    it("should start with /", () => {
      expect(NO_AVATAR_FOUND.startsWith("/")).toBe(true);
    });
  });

  describe("STUDENT_STATUS", () => {
    it("should define IMPORTED status", () => {
      expect(STUDENT_STATUS.IMPORTED).toBe("imported");
    });

    it("should define INVITED status", () => {
      expect(STUDENT_STATUS.INVITED).toBe("invited");
    });

    it("should define ONBOARDED status", () => {
      expect(STUDENT_STATUS.ONBOARDED).toBe("onboarded");
    });

    it("should have exactly 3 statuses", () => {
      expect(Object.keys(STUDENT_STATUS).length).toBe(3);
    });

    it("should all be lowercase strings", () => {
      Object.values(STUDENT_STATUS).forEach((status) => {
        expect(status).toBe(status.toLowerCase());
        expect(typeof status).toBe("string");
      });
    });
  });

  describe("WIZZARD_URL", () => {
    it("should end with student path and placeholder", () => {
      expect(WIZZARD_URL).toMatch(/\/student\/\{short-id\}$/);
    });

    it("should contain placeholder for student ID", () => {
      expect(WIZZARD_URL).toContain("{short-id}");
    });

    it("should be a valid URL format", () => {
      expect(
        WIZZARD_URL.startsWith("http://") || WIZZARD_URL.startsWith("https://"),
      ).toBe(true);
    });

    it("should include student path", () => {
      expect(WIZZARD_URL).toContain("/student/");
    });
  });

  describe("Constants immutability", () => {
    it("should be readonly objects", () => {
      // TypeScript const assertion makes them readonly
      // This test verifies they exist and have expected structure
      expect(THEME).toBeDefined();
      expect(COLORS).toBeDefined();
      expect(LANGUAGES).toBeDefined();
      expect(STUDENT_STATUS).toBeDefined();
    });

    it("should not be empty", () => {
      expect(Object.keys(THEME).length).toBeGreaterThan(0);
      expect(Object.keys(COLORS).length).toBeGreaterThan(0);
      expect(Object.keys(LANGUAGES).length).toBeGreaterThan(0);
      expect(Object.keys(STUDENT_STATUS).length).toBeGreaterThan(0);
    });
  });
});
