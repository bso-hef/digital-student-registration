import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Theme } from "@mui/material";

// Mock styling utils - must be defined before vi.mock
vi.mock("@/utils/styling.utils", () => ({
  applicationScrollbar: vi.fn((theme) => ({
    scrollbarWidth: "thin",
    scrollbarColor: `${theme.palette.text.disabled} ${theme.palette.surface.interface.background}`,
  })),
}));

import MuiPickersPopperOverride from "@/theme/overrides/MuiPickerPopper";
import { applicationScrollbar } from "@/utils/styling.utils";

/**
 * Tests for MuiPickerPopper theme overrides
 * @file tests/unit/theme/overrides/MuiPickerPopper.test.ts
 */

describe("MuiPickersPopperOverride", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const mockTheme: Theme = {
    palette: {
      surface: {
        interface: {
          background: "#ffffff",
        },
      },
      text: {
        default: "#000000",
        disabled: "#9e9e9e",
      },
      border: {
        seperator: "#e0e0e0",
      },
    },
    spacing: (factor: number) => `${8 * factor}px`,
  } as Theme;

  describe("paper styles", () => {
    it("should return correct paper styles", () => {
      const styles = MuiPickersPopperOverride.paper({ theme: mockTheme });

      expect(styles.backgroundColor).toBe("#ffffff");
      expect(styles.color).toBe("#000000");
      expect(styles.border).toBe("1px solid #e0e0e0");
      expect(styles.borderRadius).toBe("12px");
      expect(styles.marginTop).toBe("8px");
      expect(styles.overflow).toBe("hidden");
      expect(styles.overflowY).toBe("auto");
    });

    it("should include box shadow", () => {
      const styles = MuiPickersPopperOverride.paper({ theme: mockTheme });
      expect(styles.boxShadow).toBeDefined();
      expect(styles.boxShadow).toContain("rgba(2, 6, 23, 0.12)");
    });

    it("should call applicationScrollbar with theme", () => {
      MuiPickersPopperOverride.paper({ theme: mockTheme });

      expect(applicationScrollbar).toHaveBeenCalledWith(mockTheme);
    });

    it("should spread applicationScrollbar styles", () => {
      const styles = MuiPickersPopperOverride.paper({ theme: mockTheme });

      expect(styles.scrollbarWidth).toBe("thin");
      expect(styles.scrollbarColor).toContain("#9e9e9e");
    });

    it("should use theme surface background color", () => {
      const customTheme = {
        ...mockTheme,
        palette: {
          ...mockTheme.palette,
          surface: {
            interface: {
              background: "#f5f5f5",
            },
          },
        },
      } as Theme;

      const styles = MuiPickersPopperOverride.paper({ theme: customTheme });
      expect(styles.backgroundColor).toBe("#f5f5f5");
    });

    it("should use theme border separator color", () => {
      const customTheme = {
        ...mockTheme,
        palette: {
          ...mockTheme.palette,
          border: {
            seperator: "#cccccc",
          },
        },
      } as Theme;

      const styles = MuiPickersPopperOverride.paper({ theme: customTheme });
      expect(styles.border).toBe("1px solid #cccccc");
    });
  });
});
