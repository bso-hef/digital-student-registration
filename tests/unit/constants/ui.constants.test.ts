import { describe, expect, it } from "vitest";

import {
  CHECKBOX_COL_WIDTH,
  ROWS_PER_PAGE_OPTIONS,
  STEPPER_ICON_SIZE,
  TABLE_ALIGN,
} from "@/constants/ui.constants";

/**
 * Tests for UI constants
 * @file tests/unit/constants/ui.constants.test.ts
 */

describe("ui.constants", () => {
  describe("STEPPER_ICON_SIZE", () => {
    it("should be defined as 28", () => {
      expect(STEPPER_ICON_SIZE).toBe(28);
    });

    it("should be a number", () => {
      expect(typeof STEPPER_ICON_SIZE).toBe("number");
    });
  });

  describe("ROWS_PER_PAGE_OPTIONS", () => {
    it("should contain pagination options [5, 10, 25, 50, 100]", () => {
      expect(ROWS_PER_PAGE_OPTIONS).toEqual([5, 10, 25, 50, 100]);
    });

    it("should have exactly 5 options", () => {
      expect(ROWS_PER_PAGE_OPTIONS.length).toBe(5);
    });

    it("should contain only numbers", () => {
      ROWS_PER_PAGE_OPTIONS.forEach((option) => {
        expect(typeof option).toBe("number");
      });
    });

    it("should be in ascending order", () => {
      for (let i = 0; i < ROWS_PER_PAGE_OPTIONS.length - 1; i++) {
        expect(ROWS_PER_PAGE_OPTIONS[i]).toBeLessThan(
          ROWS_PER_PAGE_OPTIONS[i + 1],
        );
      }
    });
  });

  describe("CHECKBOX_COL_WIDTH", () => {
    it("should be defined as 50", () => {
      expect(CHECKBOX_COL_WIDTH).toBe(50);
    });

    it("should be a number", () => {
      expect(typeof CHECKBOX_COL_WIDTH).toBe("number");
    });
  });

  describe("TABLE_ALIGN", () => {
    it("should define LEFT alignment", () => {
      expect(TABLE_ALIGN.LEFT).toBe("left");
    });

    it("should define CENTER alignment", () => {
      expect(TABLE_ALIGN.CENTER).toBe("center");
    });

    it("should define RIGHT alignment", () => {
      expect(TABLE_ALIGN.RIGHT).toBe("right");
    });

    it("should have exactly 3 alignment options", () => {
      expect(Object.keys(TABLE_ALIGN).length).toBe(3);
    });

    it("should contain valid CSS alignment values", () => {
      const validAlignments = ["left", "center", "right"];
      Object.values(TABLE_ALIGN).forEach((alignment) => {
        expect(validAlignments).toContain(alignment);
      });
    });

    it("should be a const object", () => {
      expect(TABLE_ALIGN).toBeDefined();
      expect(typeof TABLE_ALIGN).toBe("object");
    });
  });
});
