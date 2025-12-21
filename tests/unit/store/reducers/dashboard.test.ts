import { describe, expect, it } from "vitest";

import dashboardReducer from "@/store/reducers/dashboard";
import * as TYPES from "@/store/types";

/**
 * Tests for dashboard reducer
 * @file tests/unit/store/reducers/dashboard.test.ts
 */

describe("dashboardReducer", () => {
  const initialState = {
    stats: null,
    health: null,
    recentActivity: [],
    activityLoading: false,
    loading: false,
    error: null,
    lastUpdated: null,
    layout: {
      quickStats: [
        "totalStudents",
        "totalClasses",
        "unassignedStudents",
        "onboardingProgress",
      ],
      charts: [
        "registrationTrend",
        "studentStatus",
        "classDistribution",
        "recentActivity",
      ],
    },
  };

  const mockStats = {
    totalStudents: 150,
    totalClasses: 10,
    activeStudents: 145,
    completedOnboarding: 140,
    pendingOnboarding: 10,
    recentRegistrations: 5,
  };

  it("should return initial state when no action matches", () => {
    const state = dashboardReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(state).toEqual(initialState);
  });

  describe("GET_DASHBOARD_STATS actions", () => {
    it("should handle GET_DASHBOARD_STATS_REQUEST", () => {
      const action = { type: TYPES.GET_DASHBOARD_STATS_REQUEST };
      const state = dashboardReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle GET_DASHBOARD_STATS_SUCCESS", () => {
      const action = {
        type: TYPES.GET_DASHBOARD_STATS_SUCCESS,
        payload: mockStats,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.stats).toEqual(mockStats);
      expect(state.error).toBe(null);
    });

    it("should handle GET_DASHBOARD_STATS_FAILURE", () => {
      const error = "Failed to load dashboard stats";
      const action = {
        type: TYPES.GET_DASHBOARD_STATS_FAILURE,
        payload: error,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(error);
    });

    it("should replace existing stats on success", () => {
      const existingState = {
        ...initialState,
        stats: { totalStudents: 100, totalClasses: 5 },
      };
      const newStats = mockStats;
      const action = {
        type: TYPES.GET_DASHBOARD_STATS_SUCCESS,
        payload: newStats,
      };
      const state = dashboardReducer(existingState, action);
      expect(state.stats).toEqual(newStats);
    });

    it("should clear error on successful request", () => {
      const existingState = {
        ...initialState,
        error: "Previous error",
      };
      const action = { type: TYPES.GET_DASHBOARD_STATS_REQUEST };
      const state = dashboardReducer(existingState, action);
      expect(state.error).toBe(null);
    });

    it("should preserve stats when request fails", () => {
      const existingState = {
        ...initialState,
        stats: mockStats,
      };
      const action = {
        type: TYPES.GET_DASHBOARD_STATS_FAILURE,
        payload: "Network error",
      };
      const state = dashboardReducer(existingState, action);
      expect(state.stats).toEqual(mockStats);
    });

    it("should handle stats with zero values", () => {
      const zeroStats = {
        totalStudents: 0,
        totalClasses: 0,
        activeStudents: 0,
        completedOnboarding: 0,
        pendingOnboarding: 0,
        recentRegistrations: 0,
      };
      const action = {
        type: TYPES.GET_DASHBOARD_STATS_SUCCESS,
        payload: zeroStats,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.stats).toEqual(zeroStats);
    });

    it("should handle large stat numbers", () => {
      const largeStats = {
        ...mockStats,
        totalStudents: 999999,
        totalClasses: 5000,
      };
      const action = {
        type: TYPES.GET_DASHBOARD_STATS_SUCCESS,
        payload: largeStats,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.stats).toEqual(largeStats);
    });
  });

  describe("State transitions", () => {
    it("should transition from loading to success", () => {
      let state = dashboardReducer(initialState, {
        type: TYPES.GET_DASHBOARD_STATS_REQUEST,
      });
      expect(state.loading).toBe(true);

      state = dashboardReducer(state, {
        type: TYPES.GET_DASHBOARD_STATS_SUCCESS,
        payload: mockStats,
      });
      expect(state.loading).toBe(false);
      expect(state.stats).toEqual(mockStats);
    });

    it("should transition from loading to failure", () => {
      let state = dashboardReducer(initialState, {
        type: TYPES.GET_DASHBOARD_STATS_REQUEST,
      });
      expect(state.loading).toBe(true);

      state = dashboardReducer(state, {
        type: TYPES.GET_DASHBOARD_STATS_FAILURE,
        payload: "Error",
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Error");
    });

    it("should allow multiple successive requests", () => {
      let state = dashboardReducer(initialState, {
        type: TYPES.GET_DASHBOARD_STATS_REQUEST,
      });
      state = dashboardReducer(state, {
        type: TYPES.GET_DASHBOARD_STATS_SUCCESS,
        payload: mockStats,
      });

      // Second request
      state = dashboardReducer(state, {
        type: TYPES.GET_DASHBOARD_STATS_REQUEST,
      });
      expect(state.loading).toBe(true);
      expect(state.stats).toEqual(mockStats); // Previous stats preserved
    });
  });

  describe("GET_DASHBOARD_HEALTH actions", () => {
    const mockHealth = {
      status: "healthy",
      database: "connected",
      uptime: 12345,
    };

    it("should handle GET_DASHBOARD_HEALTH_REQUEST", () => {
      const action = { type: TYPES.GET_DASHBOARD_HEALTH_REQUEST };
      const state = dashboardReducer(initialState, action);
      expect(state.error).toBe(null);
    });

    it("should handle GET_DASHBOARD_HEALTH_SUCCESS", () => {
      const action = {
        type: TYPES.GET_DASHBOARD_HEALTH_SUCCESS,
        payload: mockHealth,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.health).toEqual(mockHealth);
      expect(state.lastUpdated).toBeDefined();
      expect(state.error).toBe(null);
    });

    it("should handle GET_DASHBOARD_HEALTH_FAILURE", () => {
      const error = "Health check failed";
      const action = {
        type: TYPES.GET_DASHBOARD_HEALTH_FAILURE,
        payload: error,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.error).toBe(error);
    });
  });

  describe("GET_DASHBOARD_ACTIVITY actions", () => {
    const mockActivity = [
      { id: "1", type: "login", userId: "user1", timestamp: new Date().toISOString() },
      { id: "2", type: "registration", userId: "user2", timestamp: new Date().toISOString() },
    ];

    it("should handle GET_DASHBOARD_ACTIVITY_REQUEST", () => {
      const action = { type: TYPES.GET_DASHBOARD_ACTIVITY_REQUEST };
      const state = dashboardReducer(initialState, action);
      expect(state.activityLoading).toBe(true);
    });

    it("should handle GET_DASHBOARD_ACTIVITY_SUCCESS", () => {
      const action = {
        type: TYPES.GET_DASHBOARD_ACTIVITY_SUCCESS,
        payload: mockActivity,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.activityLoading).toBe(false);
      expect(state.recentActivity).toEqual(mockActivity);
    });

    it("should handle GET_DASHBOARD_ACTIVITY_SUCCESS with empty array", () => {
      const action = {
        type: TYPES.GET_DASHBOARD_ACTIVITY_SUCCESS,
        payload: [],
      };
      const state = dashboardReducer(initialState, action);
      expect(state.activityLoading).toBe(false);
      expect(state.recentActivity).toEqual([]);
    });

    it("should handle GET_DASHBOARD_ACTIVITY_FAILURE", () => {
      const existingState = {
        ...initialState,
        activityLoading: true,
      };
      const action = { type: TYPES.GET_DASHBOARD_ACTIVITY_FAILURE };
      const state = dashboardReducer(existingState, action);
      expect(state.activityLoading).toBe(false);
    });

    it("should preserve existing activity on failure", () => {
      const existingState = {
        ...initialState,
        recentActivity: mockActivity,
        activityLoading: true,
      };
      const action = { type: TYPES.GET_DASHBOARD_ACTIVITY_FAILURE };
      const state = dashboardReducer(existingState, action);
      expect(state.recentActivity).toEqual(mockActivity);
    });
  });

  describe("Dashboard layout actions", () => {
    const customLayout = {
      quickStats: ["totalStudents", "activeClasses"],
      charts: ["registrationTrend"],
    };

    it("should handle SET_DASHBOARD_LAYOUT", () => {
      const action = {
        type: TYPES.SET_DASHBOARD_LAYOUT,
        payload: customLayout,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.layout).toEqual(customLayout);
    });

    it("should handle RESET_DASHBOARD_LAYOUT", () => {
      const existingState = {
        ...initialState,
        layout: customLayout,
      };
      const action = { type: TYPES.RESET_DASHBOARD_LAYOUT };
      const state = dashboardReducer(existingState, action);
      expect(state.layout).toEqual(initialState.layout);
    });
  });
});
