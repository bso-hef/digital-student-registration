import type { Theme } from "@mui/material";
import { describe, expect, it } from "vitest";

import MuiDateCalendarOverride from "@/theme/overrides/MuiDateCalendar";

/**
 * Tests for MuiDateCalendar theme overrides
 * @file tests/unit/theme/overrides/MuiDateCalendar.test.ts
 */

describe("MuiDateCalendarOverride", () => {
  const mockTheme: Theme = {
    palette: {
      surface: {
        interface: {
          background: "#ffffff",
        },
      },
      text: {
        default: "#000000",
      },
      border: {
        seperator: "#e0e0e0",
      },
    },
    spacing: (value: number) => `${value * 8}px`,
  } as Theme;

  describe("root styles", () => {
    it("should return correct root styles", () => {
      const styles = MuiDateCalendarOverride.root({ theme: mockTheme });

      expect(styles.backgroundColor).toBe("#ffffff");
      expect(styles.color).toBe("#000000");
    });

    it("should use theme surface background color", () => {
      const customTheme = {
        palette: {
          surface: {
            interface: {
              background: "#f5f5f5",
            },
          },
          text: {
            default: "#000000",
          },
          border: {
            seperator: "#e0e0e0",
          },
        },
        spacing: (value: number) => `${value * 8}px`,
      } as Theme;

      const styles = MuiDateCalendarOverride.root({ theme: customTheme });
      expect(styles.backgroundColor).toBe("#f5f5f5");
    });

    it("should use theme text default color", () => {
      const customTheme = {
        palette: {
          surface: {
            interface: {
              background: "#ffffff",
            },
          },
          text: {
            default: "#333333",
          },
          border: {
            seperator: "#e0e0e0",
          },
        },
        spacing: (value: number) => `${value * 8}px`,
      } as Theme;

      const styles = MuiDateCalendarOverride.root({ theme: customTheme });
      expect(styles.color).toBe("#333333");
    });

    it("should work with dark theme colors", () => {
      const darkTheme = {
        palette: {
          surface: {
            interface: {
              background: "#1e1e1e",
            },
          },
          text: {
            default: "#ffffff",
          },
          border: {
            seperator: "#424242",
          },
        },
        spacing: (value: number) => `${value * 8}px`,
      } as Theme;

      const styles = MuiDateCalendarOverride.root({ theme: darkTheme });
      expect(styles.backgroundColor).toBe("#1e1e1e");
      expect(styles.color).toBe("#ffffff");
    });
  });
});
