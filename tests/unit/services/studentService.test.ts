import http from "@/lib/services/api";
import studentService from "@/lib/services/studentService";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the http client
vi.mock("@/lib/services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("studentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch students with pagination and filters", async () => {
      const mockResponse = {
        data: {
          students: [],
          page: 1,
          limit: 25,
          total: 0,
          pages: 0,
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const params = {
        page: 2,
        limit: 50,
        classId: "507f1f77bcf86cd799439011",
        status: "onboarded" as const,
      };
      const result = await studentService.getAll(params);

      expect(http.get).toHaveBeenCalledWith("/api/students", { params });
      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors gracefully", async () => {
      const mockError = new Error("Network error");
      vi.mocked(http.get).mockRejectedValue(mockError);

      await expect(
        studentService.getAll({ page: 1, limit: 25 }),
      ).rejects.toThrow("Network error");
    });
  });

  describe("getUnassigned", () => {
    it("should fetch unassigned students", async () => {
      const mockResponse = {
        data: {
          students: [],
          page: 1,
          limit: 25,
          total: 0,
          pages: 0,
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const result = await studentService.getUnassigned();

      expect(http.get).toHaveBeenCalledWith("/api/students?unassigned=true");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("create", () => {
    it("should create students successfully", async () => {
      const studentsData = [
        {
          firstName: "John",
          lastName: "Doe",
          dateOfBirth: "2000-01-01",
        },
      ];
      const mockResponse = {
        data: {
          created: [{ _id: "123", ...studentsData[0] }],
          createdCount: 1,
          invalidCount: 0,
        },
      };
      vi.mocked(http.post).mockResolvedValue(mockResponse);

      const result = await studentService.create(studentsData);

      expect(http.post).toHaveBeenCalledWith("/api/students", {
        students: studentsData,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle validation errors", async () => {
      const invalidData = [{ firstName: "" }];
      const mockResponse = {
        data: {
          message: "No valid students in payload",
          invalidCount: 1,
        },
      };
      vi.mocked(http.post).mockResolvedValue(mockResponse);

      const result = await studentService.create(invalidData);

      expect(result.data.invalidCount).toBe(1);
    });
  });

  describe("delete", () => {
    it("should delete multiple students", async () => {
      const ids = ["id1", "id2", "id3"];
      const mockResponse = {
        data: {
          deletedCount: 3,
        },
      };
      vi.mocked(http.delete).mockResolvedValue(mockResponse);

      const result = await studentService.delete(ids);

      expect(http.delete).toHaveBeenCalledWith("/api/students", {
        data: { ids },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle empty ids array", async () => {
      const mockResponse = {
        data: {
          message: "Invalid request body",
        },
      };
      vi.mocked(http.delete).mockResolvedValue(mockResponse);

      await studentService.delete([]);

      expect(http.delete).toHaveBeenCalledWith("/api/students", {
        data: { ids: [] },
      });
    });
  });
});
