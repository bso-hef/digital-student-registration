import {
  descendingComparator,
  getComparator,
  stableSort,
} from "@/utils/table.utils";
import { describe, expect, it } from "vitest";

/**
 * Tests for table utility functions
 * @file tests/unit/utils/table.utils.test.ts
 */

describe("table.utils", () => {
  describe("descendingComparator", () => {
    it("should return -1 when b < a", () => {
      const a = { value: 10 };
      const b = { value: 5 };
      expect(descendingComparator(a, b, "value")).toBe(-1);
    });

    it("should return 1 when b > a", () => {
      const a = { value: 5 };
      const b = { value: 10 };
      expect(descendingComparator(a, b, "value")).toBe(1);
    });

    it("should return 0 when b === a", () => {
      const a = { value: 10 };
      const b = { value: 10 };
      expect(descendingComparator(a, b, "value")).toBe(0);
    });

    it("should work with string values", () => {
      const a = { name: "Alice" };
      const b = { name: "Bob" };
      expect(descendingComparator(a, b, "name")).toBe(1);
      expect(descendingComparator(b, a, "name")).toBe(-1);
    });

    it("should work with date values", () => {
      const a = { date: new Date("2024-01-01") };
      const b = { date: new Date("2024-12-31") };
      expect(descendingComparator(a, b, "date")).toBe(1);
    });

    it("should work with negative numbers", () => {
      const a = { value: -5 };
      const b = { value: -10 };
      expect(descendingComparator(a, b, "value")).toBe(-1);
    });
  });

  describe("getComparator", () => {
    interface TestObj {
      id: number;
      name: string;
    }

    it("should return descending comparator for desc order", () => {
      const comparator = getComparator<TestObj>("desc", "id");
      const a = { id: 1, name: "A" };
      const b = { id: 2, name: "B" };
      expect(comparator(a, b)).toBe(1);
      expect(comparator(b, a)).toBe(-1);
    });

    it("should return ascending comparator for asc order", () => {
      const comparator = getComparator<TestObj>("asc", "id");
      const a = { id: 1, name: "A" };
      const b = { id: 2, name: "B" };
      expect(comparator(a, b)).toBe(-1);
      expect(comparator(b, a)).toBe(1);
    });

    it("should work with string properties", () => {
      const comparator = getComparator<TestObj>("asc", "name");
      const a = { id: 1, name: "Alice" };
      const b = { id: 2, name: "Bob" };
      expect(comparator(a, b)).toBe(-1);
      expect(comparator(b, a)).toBe(1);
    });

    it("should return 0 for equal values", () => {
      const comparator = getComparator<TestObj>("asc", "id");
      const a = { id: 5, name: "A" };
      const b = { id: 5, name: "B" };
      const result = comparator(a, b);
      expect(Math.abs(result)).toBe(0);
    });
  });

  describe("stableSort", () => {
    interface TestItem {
      id: number;
      value: number;
      name: string;
    }

    it("should sort array in ascending order", () => {
      const array: TestItem[] = [
        { id: 1, value: 3, name: "C" },
        { id: 2, value: 1, name: "A" },
        { id: 3, value: 2, name: "B" },
      ];
      const comparator = getComparator<TestItem>("asc", "value");
      const result = stableSort(array, comparator);
      expect(result.map((item) => item.value)).toEqual([1, 2, 3]);
    });

    it("should sort array in descending order", () => {
      const array: TestItem[] = [
        { id: 1, value: 1, name: "A" },
        { id: 2, value: 3, name: "C" },
        { id: 3, value: 2, name: "B" },
      ];
      const comparator = getComparator<TestItem>("desc", "value");
      const result = stableSort(array, comparator);
      expect(result.map((item) => item.value)).toEqual([3, 2, 1]);
    });

    it("should maintain stable order for equal elements", () => {
      const array: TestItem[] = [
        { id: 1, value: 1, name: "A" },
        { id: 2, value: 1, name: "B" },
        { id: 3, value: 1, name: "C" },
      ];
      const comparator = getComparator<TestItem>("asc", "value");
      const result = stableSort(array, comparator);
      // Original order should be maintained for equal values
      expect(result.map((item) => item.id)).toEqual([1, 2, 3]);
    });

    it("should handle empty array", () => {
      const array: TestItem[] = [];
      const comparator = getComparator<TestItem>("asc", "value");
      const result = stableSort(array, comparator);
      expect(result).toEqual([]);
    });

    it("should handle single element array", () => {
      const array: TestItem[] = [{ id: 1, value: 1, name: "A" }];
      const comparator = getComparator<TestItem>("asc", "value");
      const result = stableSort(array, comparator);
      expect(result).toEqual([{ id: 1, value: 1, name: "A" }]);
    });

    it("should sort by string property", () => {
      const array: TestItem[] = [
        { id: 1, value: 1, name: "Charlie" },
        { id: 2, value: 2, name: "Alice" },
        { id: 3, value: 3, name: "Bob" },
      ];
      const comparator = getComparator<TestItem>("asc", "name");
      const result = stableSort(array, comparator);
      expect(result.map((item) => item.name)).toEqual([
        "Alice",
        "Bob",
        "Charlie",
      ]);
    });

    it("should not modify original array", () => {
      const array: TestItem[] = [
        { id: 1, value: 3, name: "C" },
        { id: 2, value: 1, name: "A" },
      ];
      const originalArray = [...array];
      const comparator = getComparator<TestItem>("asc", "value");
      stableSort(array, comparator);
      expect(array).toEqual(originalArray);
    });

    it("should handle complex sorting with duplicates", () => {
      const array: TestItem[] = [
        { id: 1, value: 2, name: "A" },
        { id: 2, value: 2, name: "B" },
        { id: 3, value: 1, name: "C" },
        { id: 4, value: 2, name: "D" },
        { id: 5, value: 3, name: "E" },
      ];
      const comparator = getComparator<TestItem>("asc", "value");
      const result = stableSort(array, comparator);
      expect(result.map((item) => item.value)).toEqual([1, 2, 2, 2, 3]);
      // Check stable order for equal values (2, 2, 2)
      const itemsWithValue2 = result.filter((item) => item.value === 2);
      expect(itemsWithValue2.map((item) => item.id)).toEqual([1, 2, 4]);
    });
  });
});
