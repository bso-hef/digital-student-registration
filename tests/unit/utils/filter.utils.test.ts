import { describe, expect, it } from "vitest";

import { filterClasses, filterStudents } from "@/utils/filter.utils";

import type { ClassInterface } from "@/types/class";
import type { Student } from "@/types/db";

/**
 * Tests for filter utility functions
 * @file tests/unit/utils/filter.utils.test.ts
 */

describe("filter.utils", () => {
  describe("filterStudents", () => {
    const mockStudents: Student[] = [
      {
        _id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        class: "Class 10A",
      } as Student,
      {
        _id: "2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        class: "Class 10B",
      } as Student,
      {
        _id: "3",
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob.johnson@example.com",
        class: "Class 11A",
      } as Student,
    ];

    it("should return all students when search string is empty", () => {
      const result = filterStudents("", mockStudents);
      expect(result).toEqual(mockStudents);
    });

    it("should return all students when search string is undefined", () => {
      const result = filterStudents(undefined, mockStudents);
      expect(result).toEqual(mockStudents);
    });

    it("should return all students when search string is less than 3 characters", () => {
      const result = filterStudents("Jo", mockStudents);
      expect(result).toEqual(mockStudents);
    });

    it("should filter by firstName", () => {
      const result = filterStudents("John", mockStudents);
      expect(result).toHaveLength(2);
      expect(result[0]._id).toBe("1");
      expect(result[1]._id).toBe("3");
    });

    it("should filter by lastName", () => {
      const result = filterStudents("Smith", mockStudents);
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("2");
    });

    it("should filter by email", () => {
      const result = filterStudents("jane.smith", mockStudents);
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("2");
    });

    it("should filter by class name", () => {
      const result = filterStudents("10A", mockStudents);
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("1");
    });

    it("should be case insensitive", () => {
      const result = filterStudents("JOHN", mockStudents);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no matches found", () => {
      const result = filterStudents("xyz", mockStudents);
      expect(result).toHaveLength(0);
    });

    it("should handle empty students array", () => {
      const result = filterStudents("John", []);
      expect(result).toEqual([]);
    });

    it("should handle undefined students array", () => {
      const result = filterStudents("John", undefined);
      expect(result).toEqual([]);
    });

    it("should handle students with missing fields", () => {
      const studentsWithMissingFields: Student[] = [
        {
          _id: "1",
          firstName: "John",
        } as Student,
        {
          _id: "2",
          lastName: "Smith",
        } as Student,
      ];
      const result = filterStudents("John", studentsWithMissingFields);
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("1");
    });

    it("should match partial strings", () => {
      const result = filterStudents("joh", mockStudents);
      expect(result).toHaveLength(2);
    });

    it("should handle non-array input", () => {
      const result = filterStudents("test", {} as any);
      expect(result).toEqual([]);
    });
  });

  describe("filterClasses", () => {
    const mockClasses: ClassInterface[] = [
      {
        _id: "1",
        name: "Class 10A",
        schoolYearFrom: "2023",
        schoolYearTo: "2024",
      } as ClassInterface,
      {
        _id: "2",
        name: "Class 10B",
        schoolYearFrom: "2023",
        schoolYearTo: "2024",
      } as ClassInterface,
      {
        _id: "3",
        name: "Class 11A",
        schoolYearFrom: "2023",
        schoolYearTo: "2024",
      } as ClassInterface,
    ];

    it("should return all classes when search string is empty", () => {
      const result = filterClasses("", mockClasses);
      expect(result).toEqual(mockClasses);
    });

    it("should return all classes when search string is undefined", () => {
      const result = filterClasses(undefined, mockClasses);
      expect(result).toEqual(mockClasses);
    });

    it("should return all classes when search string is less than 3 characters", () => {
      const result = filterClasses("10", mockClasses);
      expect(result).toEqual(mockClasses);
    });

    it("should filter by class name", () => {
      const result = filterClasses("10A", mockClasses);
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("1");
    });

    it("should filter by partial class name", () => {
      const result = filterClasses("Class 10", mockClasses);
      expect(result).toHaveLength(2);
    });

    it("should be case insensitive", () => {
      const result = filterClasses("CLASS 11A", mockClasses);
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("3");
    });

    it("should return empty array when no matches found", () => {
      const result = filterClasses("xyz", mockClasses);
      expect(result).toHaveLength(0);
    });

    it("should handle empty classes array", () => {
      const result = filterClasses("Class", []);
      expect(result).toEqual([]);
    });

    it("should handle undefined classes array", () => {
      const result = filterClasses("Class", undefined);
      expect(result).toEqual([]);
    });

    it("should handle classes with missing name", () => {
      const classesWithMissingName: ClassInterface[] = [
        {
          _id: "1",
          schoolYearFrom: "2023",
          schoolYearTo: "2024",
        } as ClassInterface,
      ];
      const result = filterClasses("test", classesWithMissingName);
      expect(result).toHaveLength(0);
    });

    it("should match partial strings", () => {
      const result = filterClasses("11A", mockClasses);
      expect(result).toHaveLength(1);
    });

    it("should handle non-array input", () => {
      const result = filterClasses("test", {} as any);
      expect(result).toEqual([]);
    });
  });
});
