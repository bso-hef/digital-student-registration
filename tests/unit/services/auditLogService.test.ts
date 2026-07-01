import http from "@/lib/services/api";
import auditLogService from "@/lib/services/auditLogService";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the http client
vi.mock("@/lib/services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("auditLogService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all audit logs with default parameters", async () => {
      const mockResponse = {
        data: {
          success: true,
          logs: [],
          page: 1,
          limit: 25,
          total: 0,
          pages: 0,
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const result = await auditLogService.getAll();

      expect(http.get).toHaveBeenCalledWith("/api/audit-logs", {
        params: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should fetch audit logs with filters", async () => {
      const filters = {
        page: 2,
        limit: 50,
        category: "student",
        status: "success",
        search: "test",
      };
      const mockResponse = {
        data: {
          success: true,
          logs: [],
          page: 2,
          limit: 50,
          total: 0,
          pages: 0,
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      await auditLogService.getAll(filters);

      expect(http.get).toHaveBeenCalledWith("/api/audit-logs", {
        params: filters,
      });
    });

    it("should handle date range filters", async () => {
      const filters = {
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      };
      const mockResponse = {
        data: {
          success: true,
          logs: [],
          page: 1,
          limit: 25,
          total: 0,
          pages: 0,
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      await auditLogService.getAll(filters);

      expect(http.get).toHaveBeenCalledWith("/api/audit-logs", {
        params: filters,
      });
    });
  });

  describe("getStats", () => {
    it("should fetch audit log statistics", async () => {
      const mockResponse = {
        data: {
          success: true,
          stats: {
            totalLogs: 100,
            byCategory: { student: 50, class: 30, settings: 20 },
            byStatus: { success: 90, failure: 10 },
          },
        },
      };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const result = await auditLogService.getStats();

      expect(http.get).toHaveBeenCalledWith("/api/audit-logs/stats");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("clearLogs", () => {
    it("should clear old audit logs", async () => {
      const mockResponse = {
        data: {
          success: true,
          deletedCount: 50,
          message: "Cleared 50 audit log(s) older than 90 days",
        },
      };
      vi.mocked(http.delete).mockResolvedValue(mockResponse);

      const result = await auditLogService.clearLogs();

      expect(http.delete).toHaveBeenCalledWith("/api/audit-logs");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteSelected", () => {
    it("should delete selected audit logs", async () => {
      const ids = ["id1", "id2", "id3"];
      const mockResponse = {
        data: {
          success: true,
          deletedCount: 3,
        },
      };
      vi.mocked(http.post).mockResolvedValue(mockResponse);

      const result = await auditLogService.deleteSelected(ids);

      expect(http.post).toHaveBeenCalledWith("/api/audit-logs/delete", { ids });
      expect(result).toEqual(mockResponse);
    });

    it("should handle empty ids array", async () => {
      const mockResponse = {
        data: {
          error: "IDs array is required",
        },
      };
      vi.mocked(http.post).mockResolvedValue(mockResponse);

      await auditLogService.deleteSelected([]);

      expect(http.post).toHaveBeenCalledWith("/api/audit-logs/delete", {
        ids: [],
      });
    });
  });

  describe("export", () => {
    it("should export audit logs in CSV format", async () => {
      const mockBlob = new Blob(["csv content"], { type: "text/csv" });
      const mockResponse = { data: mockBlob };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const result = await auditLogService.export("csv");

      expect(http.get).toHaveBeenCalledWith("/api/audit-logs/export", {
        responseType: "blob",
        params: { format: "csv" },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should export audit logs in JSON format", async () => {
      const mockBlob = new Blob(["json content"], { type: "application/json" });
      const mockResponse = { data: mockBlob };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      await auditLogService.export("json");

      expect(http.get).toHaveBeenCalledWith("/api/audit-logs/export", {
        responseType: "blob",
        params: { format: "json" },
      });
    });

    it("should export with filters", async () => {
      const filters = { category: "student", status: "success" };
      const mockBlob = new Blob(["csv content"], { type: "text/csv" });
      const mockResponse = { data: mockBlob };
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      await auditLogService.export("csv", filters);

      expect(http.get).toHaveBeenCalledWith("/api/audit-logs/export", {
        responseType: "blob",
        params: { format: "csv", ...filters },
      });
    });
  });
});
