import dashboardService from "@/lib/services/dashboardService";
import {
  getDashboardActivity,
  getDashboardHealth,
  getDashboardStats,
  loadDashboardLayout,
  resetDashboardLayout,
  setDashboardLayout,
} from "@/store/actions/dashboardActions";
import * as TYPES from "@/store/types";
import * as notificationUtils from "@/utils/notification.utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("@/lib/services/dashboardService", () => ({
  default: {
    getStats: vi.fn(),
    getHealthFull: vi.fn(),
    getRecentActivity: vi.fn(),
  },
}));

vi.mock("@/utils/notification.utils", () => ({
  errorNotification: vi.fn(),
}));

vi.mock("i18next", () => ({
  default: {
    t: vi.fn((key: string) => key),
  },
}));

/**
 * Tests for dashboard actions
 * @file tests/unit/store/actions/dashboardActions.test.ts
 */

describe("dashboardActions", () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let getState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatch = vi.fn();
    getState = vi.fn();
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("getDashboardStats", () => {
    it("should dispatch request and success actions on successful fetch", async () => {
      const mockStats = {
        totalStudents: 100,
        totalClasses: 10,
        activeStudents: 95,
      };
      vi.mocked(dashboardService.getStats).mockResolvedValue({
        data: mockStats,
      });

      await getDashboardStats()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_STATS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_STATS_SUCCESS,
        payload: mockStats,
      });
    });

    it("should dispatch request and failure actions on failed fetch", async () => {
      const mockError = new Error("Network error");
      vi.mocked(dashboardService.getStats).mockRejectedValue(mockError);

      await getDashboardStats()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_STATS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_STATS_FAILURE,
        payload: expect.any(String),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("getDashboardHealth", () => {
    it("should dispatch request and success actions on successful fetch", async () => {
      const mockHealth = {
        status: "healthy",
        database: "connected",
        uptime: 12345,
      };
      vi.mocked(dashboardService.getHealthFull).mockResolvedValue({
        data: mockHealth,
      });

      await getDashboardHealth()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_HEALTH_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_HEALTH_SUCCESS,
        payload: mockHealth,
      });
    });

    it("should dispatch request and failure actions on failed fetch", async () => {
      const mockError = new Error("Health check failed");
      vi.mocked(dashboardService.getHealthFull).mockRejectedValue(mockError);

      await getDashboardHealth()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_HEALTH_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_HEALTH_FAILURE,
        payload: expect.any(String),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });

    it("should not show notification when silent is true", async () => {
      const mockError = new Error("Health check failed");
      vi.mocked(dashboardService.getHealthFull).mockRejectedValue(mockError);

      await getDashboardHealth(true)(dispatch, getState, undefined);

      expect(notificationUtils.errorNotification).not.toHaveBeenCalled();
    });
  });

  describe("getDashboardActivity", () => {
    it("should dispatch request and success actions on successful fetch", async () => {
      const mockActivities = [
        {
          id: "1",
          type: "student_created",
          timestamp: new Date().toISOString(),
        },
      ];
      vi.mocked(dashboardService.getRecentActivity).mockResolvedValue({
        data: { activities: mockActivities },
      });

      await getDashboardActivity()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_ACTIVITY_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_ACTIVITY_SUCCESS,
        payload: mockActivities,
      });
    });

    it("should dispatch failure action on failed fetch", async () => {
      const mockError = new Error("Activity fetch failed");
      vi.mocked(dashboardService.getRecentActivity).mockRejectedValue(
        mockError,
      );

      await getDashboardActivity()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_ACTIVITY_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_DASHBOARD_ACTIVITY_FAILURE,
      });
    });

    it("should handle silent mode on failure", async () => {
      const mockError = new Error("Activity fetch failed");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.mocked(dashboardService.getRecentActivity).mockRejectedValue(
        mockError,
      );

      await getDashboardActivity(false)(dispatch, getState, undefined);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("setDashboardLayout", () => {
    it("should dispatch SET_DASHBOARD_LAYOUT and save to localStorage", () => {
      const layout = {
        quickStats: ["totalStudents", "totalClasses"],
        charts: ["registrationTrend"],
      };

      setDashboardLayout(layout)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_DASHBOARD_LAYOUT,
        payload: layout,
      });
      expect(localStorage.getItem("dashboard_layout")).toBe(
        JSON.stringify(layout),
      );
    });
  });

  describe("resetDashboardLayout", () => {
    it("should dispatch RESET_DASHBOARD_LAYOUT and clear localStorage", () => {
      localStorage.setItem(
        "dashboard_layout",
        JSON.stringify({ quickStats: [], charts: [] }),
      );

      resetDashboardLayout()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.RESET_DASHBOARD_LAYOUT,
      });
      expect(localStorage.getItem("dashboard_layout")).toBeNull();
    });
  });

  describe("loadDashboardLayout", () => {
    it("should dispatch SET_DASHBOARD_LAYOUT when layout exists in localStorage", () => {
      const layout = {
        quickStats: ["totalStudents", "totalClasses", "onboardingProgress"],
        charts: ["registrationTrend", "recentActivity"],
      };
      localStorage.setItem("dashboard_layout", JSON.stringify(layout));

      loadDashboardLayout()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_DASHBOARD_LAYOUT,
        payload: layout,
      });
    });

    it("should not dispatch when no layout in localStorage", () => {
      loadDashboardLayout()(dispatch, getState, undefined);

      expect(dispatch).not.toHaveBeenCalled();
    });

    it("should migrate layout with systemHealth to recentActivity", () => {
      const oldLayout = {
        quickStats: ["totalStudents", "totalClasses"],
        charts: ["registrationTrend", "systemHealth"],
      };
      localStorage.setItem("dashboard_layout", JSON.stringify(oldLayout));

      loadDashboardLayout()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_DASHBOARD_LAYOUT,
        payload: expect.objectContaining({
          charts: expect.arrayContaining(["recentActivity"]),
        }),
      });
    });

    it("should migrate layout with activeClasses to onboardingProgress", () => {
      const oldLayout = {
        quickStats: ["totalStudents", "totalClasses", "activeClasses"],
        charts: ["registrationTrend", "recentActivity"],
      };
      localStorage.setItem("dashboard_layout", JSON.stringify(oldLayout));

      loadDashboardLayout()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_DASHBOARD_LAYOUT,
        payload: expect.objectContaining({
          quickStats: expect.arrayContaining(["onboardingProgress"]),
        }),
      });
      // Should not include activeClasses
      const call = dispatch.mock.calls[0][0];
      expect(call.payload.quickStats).not.toContain("activeClasses");
    });

    it("should handle invalid JSON in localStorage", () => {
      localStorage.setItem("dashboard_layout", "invalid-json");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      loadDashboardLayout()(dispatch, getState, undefined);

      expect(dispatch).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
