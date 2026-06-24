import { THEME } from "@/constants/general.constants";
import type { Theme } from "@mui/material";
import { describe, expect, it, vi } from "vitest";

import MuiCssBaselineOverride from "@/theme/overrides/MuiCssBaseline";

// Mock the general.utils module
vi.mock("@/utils/general.utils", () => ({
  isFirefox: false,
}));

/**
 * Tests for MuiCssBaseline theme overrides
 * @file tests/unit/theme/overrides/MuiCssBaseline.test.ts
 */

describe("MuiCssBaselineOverride", () => {
  const createMockTheme = (mode: "light" | "dark"): Theme =>
    ({
      palette: {
        mode,
        text: {
          primary: "#000000",
          disabled: "#9e9e9e",
        },
        primary: {
          main: "#1976d2",
          light: "#42a5f5",
        },
        surface: {
          interface: {
            background: "#ffffff",
          },
        },
      },
    }) as Theme;

  describe("Light mode", () => {
    it("should return override object for light theme", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(overrides).toBeDefined();
      expect(overrides["*::-webkit-scrollbar"]).toBeDefined();
    });

    it("should use disabled text color for scrollbar thumb in light mode", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(overrides["*::-webkit-scrollbar-thumb"].backgroundColor).toBe(
        theme.palette.text.disabled,
      );
    });

    it("should use primary light for hover background in light mode", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(
        overrides["*::-webkit-scrollbar-thumb:hover"].backgroundColor,
      ).toBe(theme.palette.primary.light);
    });
  });

  describe("Dark mode", () => {
    it("should return override object for dark theme", () => {
      const theme = createMockTheme("dark");
      const overrides = MuiCssBaselineOverride(theme);

      expect(overrides).toBeDefined();
      expect(overrides["*::-webkit-scrollbar"]).toBeDefined();
    });

    it("should use primary text color for scrollbar thumb in dark mode", () => {
      const theme = createMockTheme("dark");
      const overrides = MuiCssBaselineOverride(theme);

      expect(overrides["*::-webkit-scrollbar-thumb"].backgroundColor).toBe(
        theme.palette.text.primary,
      );
    });

    it("should use primary main for hover background in dark mode", () => {
      const theme = createMockTheme("dark");
      const overrides = MuiCssBaselineOverride(theme);

      expect(
        overrides["*::-webkit-scrollbar-thumb:hover"].backgroundColor,
      ).toBe(theme.palette.primary.main);
    });
  });

  describe("Firefox support", () => {
    it("should not include Firefox scrollbar styles when not Firefox", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      // When isFirefox is false, the spread should evaluate to an empty object
      expect(overrides["*"]).toBeUndefined();
    });

    it("should include Firefox scrollbar styles when Firefox", async () => {
      // Re-import with Firefox mock
      vi.resetModules();
      vi.doMock("@/utils/general.utils", () => ({
        isFirefox: true,
      }));

      const { default: MuiCssBaselineWithFirefox } =
        await import("@/theme/overrides/MuiCssBaseline");

      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineWithFirefox(theme);

      expect(overrides["*"]).toBeDefined();
      expect(overrides["*"]).toHaveProperty("scrollbarWidth", "thin");
      expect(overrides["*"]).toHaveProperty("scrollbarColor");

      // Reset mocks
      vi.resetModules();
      vi.doMock("@/utils/general.utils", () => ({
        isFirefox: false,
      }));
    });
  });

  describe("Scrollbar configuration", () => {
    it("should set scrollbar width and height", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(overrides["*::-webkit-scrollbar"]).toEqual({
        width: 4,
        height: 4,
        borderRadius: 4,
      });
    });

    it("should configure scrollbar track", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(overrides["*::-webkit-scrollbar-track"]).toBeDefined();
      expect(overrides["*::-webkit-scrollbar-track"].backgroundColor).toBe(
        theme.palette.surface.interface.background,
      );
    });

    it("should set border radius for scrollbar thumb", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(overrides["*::-webkit-scrollbar-thumb"].borderRadius).toBe(4);
    });

    it("should set hover cursor for scrollbar", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(overrides["*::-webkit-scrollbar-thumb:hover"].cursor).toBe(
        "pointer",
      );
    });
  });

  describe("Document scrollbar", () => {
    it("should configure html and body scrollbars", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(
        overrides["html::-webkit-scrollbar, body::-webkit-scrollbar"],
      ).toEqual({
        width: 4,
        height: 4,
      });
    });

    it("should configure html and body scrollbar track", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(
        overrides[
          "html::-webkit-scrollbar-track, body::-webkit-scrollbar-track"
        ],
      ).toBeDefined();
    });

    it("should configure html and body scrollbar thumb", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(
        overrides[
          "html::-webkit-scrollbar-thumb, body::-webkit-scrollbar-thumb"
        ],
      ).toBeDefined();
    });

    it("should configure html and body scrollbar thumb hover", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(
        overrides[
          "html::-webkit-scrollbar-thumb:hover, body::-webkit-scrollbar-thumb:hover"
        ],
      ).toBeDefined();
    });
  });

  describe("Accessibility", () => {
    it("should include forced-colors media query", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(overrides["@media (forced-colors: active)"]).toBeDefined();
      expect(overrides["@media (forced-colors: active)"]["*"]).toEqual({
        scrollbarColor: "auto",
      });
    });

    it("should include prefers-reduced-motion media query", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(
        overrides["@media (prefers-reduced-motion: reduce)"],
      ).toBeDefined();
      expect(
        overrides["@media (prefers-reduced-motion: reduce)"]["*"],
      ).toBeDefined();
    });

    it("should disable animations when reduced motion is preferred", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      const reducedMotion =
        overrides["@media (prefers-reduced-motion: reduce)"]["*"];
      expect(reducedMotion.animationDuration).toBe("0.01ms !important");
      expect(reducedMotion.animationIterationCount).toBe("1 !important");
      expect(reducedMotion.transitionDuration).toBe("0.01ms !important");
      expect(reducedMotion.scrollBehavior).toBe("auto !important");
    });
  });

  describe("Font import", () => {
    it("should include Inter font import", () => {
      const theme = createMockTheme("light");
      const overrides = MuiCssBaselineOverride(theme);

      expect(overrides["@import"]).toBeDefined();
      expect(overrides["@import"][0]).toContain("fonts.googleapis.com");
      expect(overrides["@import"][0]).toContain("Inter");
    });
  });
});
