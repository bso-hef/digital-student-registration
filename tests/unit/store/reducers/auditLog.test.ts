import { describe, expect, it } from "vitest";

import auditLogReducer, {
  AuditLogEntry,
  AuditLogFilters,
  AuditLogStats,
} from "@/store/reducers/auditLog";
import * as TYPES from "@/store/types";

/**
 * Tests for auditLog reducer
 * @file tests/unit/store/reducers/auditLog.test.ts
 */

describe("auditLogReducer", () => {
  const initialState = {
    logs: [],
    loading: false,
    error: null,
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
    filters: {},
    stats: null,
    statsLoading: false,
    exporting: false,
    clearing: false,
  };

  const mockLog: AuditLogEntry = {
    _id: "log1",
    action: "CREATE",
    category: "STUDENT",
    description: "Created student",
    status: "success",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0",
    timestamp: new Date(),
    metadata: { studentId: "student1" },
  };

  const mockStats: AuditLogStats = {
    total: 100,
    byCategory: { STUDENT: 50, CLASS: 30, SETTINGS: 20 },
    byAction: { CREATE: 40, UPDATE: 35, DELETE: 25 },
    byStatus: { success: 85, failure: 10, partial: 5 },
    recentActivity: { "2024-01": 50, "2024-02": 50 },
    topUsers: { user1: 60, user2: 40 },
  };

  it("should return initial state when no action matches", () => {
    const state = auditLogReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(state).toEqual(initialState);
  });

  describe("GET_AUDIT_LOGS actions", () => {
    it("should handle GET_AUDIT_LOGS_REQUEST", () => {
      const action = { type: TYPES.GET_AUDIT_LOGS_REQUEST };
      const state = auditLogReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle GET_AUDIT_LOGS_SUCCESS with all fields", () => {
      const action = {
        type: TYPES.GET_AUDIT_LOGS_SUCCESS,
        payload: {
          logs: [mockLog],
          page: 2,
          limit: 50,
          total: 100,
          pages: 2,
        },
      };
      const state = auditLogReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.logs).toEqual([mockLog]);
      expect(state.page).toBe(2);
      expect(state.limit).toBe(50);
      expect(state.total).toBe(100);
      expect(state.pages).toBe(2);
      expect(state.error).toBe(null);
    });

    it("should handle GET_AUDIT_LOGS_SUCCESS with null logs", () => {
      const action = {
        type: TYPES.GET_AUDIT_LOGS_SUCCESS,
        payload: {
          logs: null,
          page: null,
          limit: null,
          total: null,
          pages: null,
        },
      };
      const state = auditLogReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.logs).toEqual([]);
      expect(state.page).toBe(1);
      expect(state.limit).toBe(25);
      expect(state.total).toBe(0);
      expect(state.pages).toBe(0);
    });

    it("should handle GET_AUDIT_LOGS_FAILURE", () => {
      const action = {
        type: TYPES.GET_AUDIT_LOGS_FAILURE,
        payload: "Failed to load logs",
      };
      const state = auditLogReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Failed to load logs");
    });
  });

  describe("GET_AUDIT_LOG_STATS actions", () => {
    it("should handle GET_AUDIT_LOG_STATS_REQUEST", () => {
      const action = { type: TYPES.GET_AUDIT_LOG_STATS_REQUEST };
      const state = auditLogReducer(initialState, action);
      expect(state.statsLoading).toBe(true);
    });

    it("should handle GET_AUDIT_LOG_STATS_SUCCESS", () => {
      const action = {
        type: TYPES.GET_AUDIT_LOG_STATS_SUCCESS,
        payload: { stats: mockStats },
      };
      const state = auditLogReducer(initialState, action);
      expect(state.statsLoading).toBe(false);
      expect(state.stats).toEqual(mockStats);
    });

    it("should handle GET_AUDIT_LOG_STATS_FAILURE", () => {
      const action = { type: TYPES.GET_AUDIT_LOG_STATS_FAILURE };
      const state = auditLogReducer(initialState, action);
      expect(state.statsLoading).toBe(false);
    });
  });

  describe("EXPORT_AUDIT_LOGS actions", () => {
    it("should handle EXPORT_AUDIT_LOGS_REQUEST", () => {
      const action = { type: TYPES.EXPORT_AUDIT_LOGS_REQUEST };
      const state = auditLogReducer(initialState, action);
      expect(state.exporting).toBe(true);
    });

    it("should handle EXPORT_AUDIT_LOGS_SUCCESS", () => {
      const existingState = { ...initialState, exporting: true };
      const action = { type: TYPES.EXPORT_AUDIT_LOGS_SUCCESS };
      const state = auditLogReducer(existingState, action);
      expect(state.exporting).toBe(false);
    });

    it("should handle EXPORT_AUDIT_LOGS_FAILURE", () => {
      const existingState = { ...initialState, exporting: true };
      const action = { type: TYPES.EXPORT_AUDIT_LOGS_FAILURE };
      const state = auditLogReducer(existingState, action);
      expect(state.exporting).toBe(false);
    });
  });

  describe("CLEAR_AUDIT_LOGS actions", () => {
    it("should handle CLEAR_AUDIT_LOGS_REQUEST", () => {
      const action = { type: TYPES.CLEAR_AUDIT_LOGS_REQUEST };
      const state = auditLogReducer(initialState, action);
      expect(state.clearing).toBe(true);
    });

    it("should handle CLEAR_AUDIT_LOGS_SUCCESS", () => {
      const existingState = {
        ...initialState,
        logs: [mockLog],
        total: 100,
        pages: 4,
        clearing: true,
      };
      const action = { type: TYPES.CLEAR_AUDIT_LOGS_SUCCESS };
      const state = auditLogReducer(existingState, action);
      expect(state.clearing).toBe(false);
      expect(state.logs).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.pages).toBe(0);
    });

    it("should handle CLEAR_AUDIT_LOGS_FAILURE", () => {
      const existingState = { ...initialState, clearing: true };
      const action = { type: TYPES.CLEAR_AUDIT_LOGS_FAILURE };
      const state = auditLogReducer(existingState, action);
      expect(state.clearing).toBe(false);
    });
  });

  describe("SET_AUDIT_LOG_FILTERS action", () => {
    it("should handle SET_AUDIT_LOG_FILTERS", () => {
      const filters: AuditLogFilters = {
        category: "STUDENT",
        action: "CREATE",
        status: "success",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        search: "test",
      };
      const existingState = { ...initialState, page: 5 };
      const action = {
        type: TYPES.SET_AUDIT_LOG_FILTERS,
        payload: filters,
      };
      const state = auditLogReducer(existingState, action);
      expect(state.filters).toEqual(filters);
      expect(state.page).toBe(1); // Should reset to page 1
    });
  });

  describe("SET_AUDIT_LOG_PAGE action", () => {
    it("should handle SET_AUDIT_LOG_PAGE", () => {
      const action = {
        type: TYPES.SET_AUDIT_LOG_PAGE,
        payload: 3,
      };
      const state = auditLogReducer(initialState, action);
      expect(state.page).toBe(3);
    });
  });

  describe("State transitions", () => {
    it("should clear error on new request", () => {
      const stateWithError = {
        ...initialState,
        error: "Previous error",
      };
      const action = { type: TYPES.GET_AUDIT_LOGS_REQUEST };
      const state = auditLogReducer(stateWithError, action);
      expect(state.error).toBe(null);
    });

    it("should preserve logs when stats request fails", () => {
      const existingState = {
        ...initialState,
        logs: [mockLog],
      };
      const action = { type: TYPES.GET_AUDIT_LOG_STATS_FAILURE };
      const state = auditLogReducer(existingState, action);
      expect(state.logs).toEqual([mockLog]);
    });

    it("should handle multiple filter updates", () => {
      let state = auditLogReducer(initialState, {
        type: TYPES.SET_AUDIT_LOG_FILTERS,
        payload: { category: "STUDENT" },
      });
      expect(state.filters).toEqual({ category: "STUDENT" });

      state = auditLogReducer(state, {
        type: TYPES.SET_AUDIT_LOG_FILTERS,
        payload: { category: "CLASS", action: "UPDATE" },
      });
      expect(state.filters).toEqual({ category: "CLASS", action: "UPDATE" });
    });
  });
});
