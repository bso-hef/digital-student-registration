import { THEME } from "@/constants/general.constants";
import {
  applicationScrollbar,
  capitalizeFirstLetter,
} from "@/utils/styling.utils";
import { Theme } from "@mui/material";
import { describe, expect, it } from "vitest";

/**
 * Tests for styling utility functions
 * @file tests/unit/utils/styling.utils.test.ts
 */

describe("styling.utils", () => {
  describe("applicationScrollbar", () => {
    const createMockTheme = (mode: "light" | "dark"): Theme =>
      ({
        palette: {
          mode,
        },
      }) as Theme;

    it("should return scrollbar styles for light theme", () => {
      const theme = createMockTheme("light");
      const styles = applicationScrollbar(theme);

      expect(styles).toHaveProperty("&::-webkit-scrollbar");
      expect(styles).toHaveProperty("&::-webkit-scrollbar-track");
      expect(styles).toHaveProperty("&::-webkit-scrollbar-thumb");
    });

    it("should return scrollbar styles for dark theme", () => {
      const theme = createMockTheme("dark");
      const styles = applicationScrollbar(theme);

      expect(styles).toHaveProperty("&::-webkit-scrollbar");
      expect(styles).toHaveProperty("&::-webkit-scrollbar-track");
      expect(styles).toHaveProperty("&::-webkit-scrollbar-thumb");
    });

    it("should set correct scrollbar width and height", () => {
      const theme = createMockTheme("light");
      const styles = applicationScrollbar(theme);

      expect(styles["&::-webkit-scrollbar"]).toEqual({
        width: 4,
        height: 4,
        borderRadius: 4,
      });
    });

    it("should set transparent background for dark theme track", () => {
      const theme = createMockTheme("dark");
      const styles = applicationScrollbar(theme);

      expect(styles["&::-webkit-scrollbar-track"].backgroundColor).toBe(
        "transparent",
      );
    });

    it("should set #FAFAFA background for light theme track", () => {
      const theme = createMockTheme("light");
      const styles = applicationScrollbar(theme);

      expect(styles["&::-webkit-scrollbar-track"].backgroundColor).toBe(
        "#FAFAFA",
      );
    });

    it("should set correct thumb color for dark theme", () => {
      const theme = createMockTheme("dark");
      const styles = applicationScrollbar(theme);

      expect(styles["&::-webkit-scrollbar-thumb"].backgroundColor).toBe(
        "#4DBFC3",
      );
    });

    it("should set correct thumb color for light theme", () => {
      const theme = createMockTheme("light");
      const styles = applicationScrollbar(theme);

      expect(styles["&::-webkit-scrollbar-thumb"].backgroundColor).toBe(
        "#CFD5DE",
      );
    });

    it("should set correct thumb hover color for dark theme", () => {
      const theme = createMockTheme("dark");
      const styles = applicationScrollbar(theme);

      expect(
        styles["&::-webkit-scrollbar-thumb"]["&:hover"].backgroundColor,
      ).toBe("#82D7DA");
    });

    it("should set transparent hover color for light theme", () => {
      const theme = createMockTheme("light");
      const styles = applicationScrollbar(theme);

      expect(
        styles["&::-webkit-scrollbar-thumb"]["&:hover"].backgroundColor,
      ).toBe("transparent");
    });

    it("should apply border radius to scrollbar thumb", () => {
      const theme = createMockTheme("light");
      const styles = applicationScrollbar(theme);

      expect(styles["&::-webkit-scrollbar-thumb"].borderRadius).toBe("4px");
    });

    it("should check theme mode using THEME constant", () => {
      const darkTheme = createMockTheme(THEME.DARK as "dark");
      const lightTheme = createMockTheme(THEME.LIGHT as "light");

      const darkStyles = applicationScrollbar(darkTheme);
      const lightStyles = applicationScrollbar(lightTheme);

      expect(darkStyles["&::-webkit-scrollbar-track"].backgroundColor).not.toBe(
        lightStyles["&::-webkit-scrollbar-track"].backgroundColor,
      );
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize first letter of lowercase string", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter("world")).toBe("World");
    });

    it("should capitalize first letter of uppercase string", () => {
      expect(capitalizeFirstLetter("HELLO")).toBe("Hello");
      expect(capitalizeFirstLetter("WORLD")).toBe("World");
    });

    it("should capitalize first letter of mixed case string", () => {
      expect(capitalizeFirstLetter("hELLO")).toBe("Hello");
      expect(capitalizeFirstLetter("wOrLd")).toBe("World");
    });

    it("should handle single character strings", () => {
      expect(capitalizeFirstLetter("a")).toBe("A");
      expect(capitalizeFirstLetter("Z")).toBe("Z");
    });

    it("should handle empty string", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });

    it("should handle non-string values", () => {
      expect(capitalizeFirstLetter(123 as unknown as string)).toBe("");
      expect(capitalizeFirstLetter(null as unknown as string)).toBe("");
      expect(capitalizeFirstLetter(undefined as unknown as string)).toBe("");
    });

    it("should handle strings with spaces", () => {
      expect(capitalizeFirstLetter("hello world")).toBe("Hello world");
      expect(capitalizeFirstLetter("HELLO WORLD")).toBe("Hello world");
    });

    it("should handle strings starting with numbers", () => {
      expect(capitalizeFirstLetter("123abc")).toBe("123abc");
    });

    it("should handle strings with special characters", () => {
      expect(capitalizeFirstLetter("!hello")).toBe("!hello");
      expect(capitalizeFirstLetter("@world")).toBe("@world");
    });

    it("should lowercase all characters except the first", () => {
      expect(capitalizeFirstLetter("HELLO WORLD")).toBe("Hello world");
      expect(capitalizeFirstLetter("TEST STRING")).toBe("Test string");
    });

    it("should handle strings with accented characters", () => {
      expect(capitalizeFirstLetter("école")).toBe("École");
      expect(capitalizeFirstLetter("CAFÉ")).toBe("Café");
    });
  });
});
