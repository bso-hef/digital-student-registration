import type { Theme } from "@mui/material";
import { describe, expect, it } from "vitest";

import MuiFormControlLabelOverride from "@/theme/overrides/MuiFormControlLabel";

/**
 * Tests for MuiFormControlLabel theme overrides
 * @file tests/unit/theme/overrides/MuiFormControlLabel.test.ts
 */

describe("MuiFormControlLabelOverride", () => {
  const mockTheme: Theme = {
    palette: {
      text: {
        default: "#333333",
      },
    },
  } as Theme;

  describe("root styles", () => {
    it("should return correct root styles", () => {
      const styles = MuiFormControlLabelOverride.root({ theme: mockTheme });

      expect(styles.color).toBe("#333333");
      expect(styles.marginLeft).toBe(0);
    });

    it("should use theme text default color", () => {
      const customTheme = {
        palette: {
          text: {
            default: "#ff0000",
          },
        },
      } as Theme;

      const styles = MuiFormControlLabelOverride.root({ theme: customTheme });
      expect(styles.color).toBe("#ff0000");
    });
  });

  describe("label styles", () => {
    it("should return correct label styles", () => {
      const styles = MuiFormControlLabelOverride.label({ theme: mockTheme });

      expect(styles.fontSize).toBe("14px");
      expect(styles.fontWeight).toBe(400);
      expect(styles.color).toBe("#333333");
    });

    it("should use theme text default color for label", () => {
      const customTheme = {
        palette: {
          text: {
            default: "#00ff00",
          },
        },
      } as Theme;

      const styles = MuiFormControlLabelOverride.label({ theme: customTheme });
      expect(styles.color).toBe("#00ff00");
    });
  });
});
