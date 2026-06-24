import auditLogService from "@/lib/services/auditLogService";
import {
  clearAuditLogs,
  deleteSelectedAuditLogs,
  exportAuditLogs,
  getAuditLogStats,
  getAuditLogs,
  setAuditLogFilters,
  setAuditLogPage,
} from "@/store/actions/auditLogActions";
import * as TYPES from "@/store/types";
import * as notificationUtils from "@/utils/notification.utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("@/lib/services/auditLogService", () => ({
  default: {
    getAll: vi.fn(),
    getStats: vi.fn(),
    export: vi.fn(),
    clearLogs: vi.fn(),
    deleteSelected: vi.fn(),
  },
}));

vi.mock("@/utils/notification.utils", () => ({
  errorNotification: vi.fn(),
  successNotification: vi.fn(),
}));

vi.mock("i18next", () => ({
  default: {
    t: vi.fn((key: string) => key),
  },
}));

/**
 * Tests for audit log actions
 * @file tests/unit/store/actions/auditLogActions.test.ts
 */

describe("auditLogActions", () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let getState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatch = vi.fn();
    getState = vi.fn(() => ({
      auditLog: {
        page: 1,
        limit: 10,
        filters: {},
      },
    }));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getAuditLogs", () => {
    it("should dispatch request and success actions on successful fetch", async () => {
      const mockData = {
        logs: [{ id: "1", action: "test" }],
        total: 1,
        page: 1,
        pages: 1,
      };
      vi.mocked(auditLogService.getAll).mockResolvedValue({ data: mockData });

      await getAuditLogs()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_AUDIT_LOGS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_AUDIT_LOGS_SUCCESS,
        payload: mockData,
      });
    });

    it("should dispatch failure action on error", async () => {
      const mockError = new Error("Fetch failed");
      vi.mocked(auditLogService.getAll).mockRejectedValue(mockError);

      await getAuditLogs()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_AUDIT_LOGS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_AUDIT_LOGS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });

    it("should pass filters to service", async () => {
      const filters = { action: "create", startDate: "2024-01-01" };
      vi.mocked(auditLogService.getAll).mockResolvedValue({ data: {} });

      await getAuditLogs(filters)(dispatch, getState, undefined);

      expect(auditLogService.getAll).toHaveBeenCalledWith({
        ...filters,
        page: 1,
        limit: 10,
      });
    });
  });

  describe("getAuditLogStats", () => {
    it("should dispatch request and success actions on successful fetch", async () => {
      const mockStats = {
        totalLogs: 100,
        todayLogs: 10,
        actionCounts: { create: 50, update: 30, delete: 20 },
      };
      vi.mocked(auditLogService.getStats).mockResolvedValue({
        data: mockStats,
      });

      await getAuditLogStats()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_AUDIT_LOG_STATS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_AUDIT_LOG_STATS_SUCCESS,
        payload: mockStats,
      });
    });

    it("should dispatch failure action on error", async () => {
      vi.mocked(auditLogService.getStats).mockRejectedValue(
        new Error("Stats failed"),
      );

      await getAuditLogStats()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_AUDIT_LOG_STATS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("exportAuditLogs", () => {
    beforeEach(() => {
      // Mock DOM methods
      global.URL.createObjectURL = vi.fn(() => "blob:test");
      global.URL.revokeObjectURL = vi.fn();
      document.createElement = vi.fn().mockImplementation((tag: string) => {
        if (tag === "a") {
          return {
            href: "",
            download: "",
            click: vi.fn(),
          };
        }
        return {};
      });
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
    });

    it("should export as CSV successfully", async () => {
      vi.mocked(auditLogService.export).mockResolvedValue({ data: "csv,data" });

      await exportAuditLogs("csv")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.EXPORT_AUDIT_LOGS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.EXPORT_AUDIT_LOGS_SUCCESS,
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should export as JSON successfully", async () => {
      vi.mocked(auditLogService.export).mockResolvedValue({
        data: '{"test": "data"}',
      });

      await exportAuditLogs("json")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.EXPORT_AUDIT_LOGS_SUCCESS,
      });
    });

    it("should dispatch failure on export error", async () => {
      vi.mocked(auditLogService.export).mockRejectedValue(
        new Error("Export failed"),
      );

      await exportAuditLogs("csv")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.EXPORT_AUDIT_LOGS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("clearAuditLogs", () => {
    it("should clear logs and refresh on success", async () => {
      vi.mocked(auditLogService.clearLogs).mockResolvedValue({});
      vi.mocked(auditLogService.getAll).mockResolvedValue({ data: {} });

      await clearAuditLogs()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CLEAR_AUDIT_LOGS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CLEAR_AUDIT_LOGS_SUCCESS,
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on clear error", async () => {
      vi.mocked(auditLogService.clearLogs).mockRejectedValue(
        new Error("Clear failed"),
      );

      await clearAuditLogs()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CLEAR_AUDIT_LOGS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("deleteSelectedAuditLogs", () => {
    it("should delete selected logs and refresh on success", async () => {
      vi.mocked(auditLogService.deleteSelected).mockResolvedValue({});
      vi.mocked(auditLogService.getAll).mockResolvedValue({ data: {} });

      await deleteSelectedAuditLogs(["1", "2"])(dispatch, getState, undefined);

      expect(auditLogService.deleteSelected).toHaveBeenCalledWith(["1", "2"]);
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CLEAR_AUDIT_LOGS_SUCCESS,
      });
    });

    it("should dispatch failure on delete error", async () => {
      vi.mocked(auditLogService.deleteSelected).mockRejectedValue(
        new Error("Delete failed"),
      );

      await deleteSelectedAuditLogs(["1"])(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CLEAR_AUDIT_LOGS_FAILURE,
        payload: expect.any(Object),
      });
    });
  });

  describe("setAuditLogFilters", () => {
    it("should dispatch filters and fetch logs", async () => {
      const filters = { action: "create" };
      vi.mocked(auditLogService.getAll).mockResolvedValue({ data: {} });

      await setAuditLogFilters(filters)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_AUDIT_LOG_FILTERS,
        payload: filters,
      });
    });
  });

  describe("setAuditLogPage", () => {
    it("should dispatch page and fetch logs", async () => {
      vi.mocked(auditLogService.getAll).mockResolvedValue({ data: {} });

      await setAuditLogPage(2)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_AUDIT_LOG_PAGE,
        payload: 2,
      });
    });
  });
});
