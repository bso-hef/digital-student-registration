import http from "@/lib/services/api";
import classService from "@/lib/services/classService";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the http client
vi.mock("@/lib/services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("classService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch paginated classes with an optional search term", async () => {
      const mockResponse = {
        data: {
          classes: [],
          page: 1,
          limit: 25,
          total: 0,
          pages: 0,
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const result = await classService.getAll(1, 25, "10A");

      expect(http.get).toHaveBeenCalledWith("/api/classes", {
        params: {
          page: 1,
          limit: 25,
          search: "10A",
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getPublic", () => {
    it("should fetch public classes", async () => {
      const mockResponse = {
        data: {
          classes: [
            {
              _id: "class1",
              name: "10A",
              active: true,
            },
          ],
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const result = await classService.getPublic();

      expect(http.get).toHaveBeenCalledWith("/api/classes/public");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("get", () => {
    it("should fetch a class by ID", async () => {
      const classId = "class123";
      const mockResponse = {
        data: {
          _id: classId,
          name: "Class 1A",
          schoolYearFrom: "2024-01-01",
          schoolYearTo: "2025-01-01",
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const result = await classService.get(classId);

      expect(http.get).toHaveBeenCalledWith(`/api/classes/${classId}`);
      expect(result).toEqual(mockResponse);
    });

    it("should handle 404 errors", async () => {
      const classId = "nonexistent";
      vi.mocked(http.get).mockRejectedValue(new Error("Class not found"));

      await expect(classService.get(classId)).rejects.toThrow(
        "Class not found",
      );
    });
  });

  describe("create", () => {
    it("should create classes successfully", async () => {
      const classesData = [
        {
          name: "Class 1A",
          schoolYearFrom: "2024-01-01",
          schoolYearTo: "2025-01-01",
          grade: 1,
          isVocational: false,
          requiresEmployerInfo: false,
          active: true,
        },
      ];
      const mockResponse = {
        data: {
          classes: [{ _id: "123", ...classesData[0] }],
          createdCount: 1,
          invalidCount: 0,
        },
      };
      vi.mocked(http.post).mockResolvedValue(mockResponse);

      const result = await classService.create(classesData);

      expect(http.post).toHaveBeenCalledWith("/api/classes", {
        classes: classesData,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle validation errors", async () => {
      const invalidData = [
        {
          name: "Invalid Class",
          schoolYearFrom: "2025-01-01",
          schoolYearTo: "2024-01-01", // Invalid: To before From
        },
      ];
      const mockResponse = {
        data: {
          message: "No valid classes in payload",
          invalidCount: 1,
        },
      };
      vi.mocked(http.post).mockResolvedValue(mockResponse);

      const result = await classService.create(invalidData);

      expect(result.data.invalidCount).toBe(1);
    });
  });

  describe("patch", () => {
    it("should update a class", async () => {
      const classId = "class123";
      const updateData = { name: "Updated Class Name" };
      const mockResponse = {
        data: {
          _id: classId,
          name: "Updated Class Name",
        },
      };
      vi.mocked(http.patch).mockResolvedValue(mockResponse);

      const result = await classService.patch(classId, updateData);

      expect(http.patch).toHaveBeenCalledWith(
        `/api/classes/${classId}`,
        updateData,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("delete", () => {
    it("should delete multiple classes", async () => {
      const ids = ["id1", "id2"];
      const mockResponse = {
        data: {
          deletedCount: 2,
        },
      };
      vi.mocked(http.delete).mockResolvedValue(mockResponse);

      const result = await classService.delete(ids);

      expect(http.delete).toHaveBeenCalledWith("/api/classes", {
        data: { ids },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getStudentsInClass", () => {
    it("should fetch students in a class", async () => {
      const classId = "class123";
      const mockResponse = {
        data: {
          students: [{ _id: "student1", firstName: "John", lastName: "Doe" }],
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const result = await classService.getStudentsInClass(classId);

      expect(http.get).toHaveBeenCalledWith(`/api/classes/${classId}/students`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("addStudentsToClass", () => {
    it("should add students to a class", async () => {
      const classId = "class123";
      const studentIds = ["student1", "student2"];
      const mockResponse = {
        data: {
          message: "Students added to class successfully",
          count: 2,
        },
      };
      vi.mocked(http.post).mockResolvedValue(mockResponse);

      const result = await classService.addStudentsToClass(classId, studentIds);

      expect(http.post).toHaveBeenCalledWith(
        `/api/classes/${classId}/students`,
        { studentIds },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("removeStudentsFromClass", () => {
    it("should remove students from a class", async () => {
      const classId = "class123";
      const studentIds = ["student1", "student2"];
      const mockResponse = {
        data: {
          message: "Students removed from class successfully",
          count: 2,
        },
      };
      vi.mocked(http.delete).mockResolvedValue(mockResponse);

      const result = await classService.removeStudentsFromClass(
        classId,
        studentIds,
      );

      expect(http.delete).toHaveBeenCalledWith(
        `/api/classes/${classId}/students`,
        { data: { studentIds } },
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
