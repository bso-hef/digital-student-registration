import { describe, expect, it } from "vitest";

import * as TYPES from "../types";
import auditLogReducer, { AuditLogState } from "./auditLog";

describe("auditLogReducer", () => {
  const initialState: AuditLogState = {
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

  it("should return initial state", () => {
    const result = auditLogReducer(undefined, { type: "UNKNOWN" });
    expect(result).toEqual(initialState);
  });

  it("should handle GET_AUDIT_LOGS_REQUEST", () => {
    const result = auditLogReducer(initialState, {
      type: TYPES.GET_AUDIT_LOGS_REQUEST,
    });

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should handle GET_AUDIT_LOGS_SUCCESS", () => {
    const mockLogs = [
      {
        _id: "1",
        action: "CREATE",
        timestamp: new Date(),
      } as Partial<AuditLogEntry>,
      {
        _id: "2",
        action: "UPDATE",
        timestamp: new Date(),
      } as Partial<AuditLogEntry>,
    ];

    const result = auditLogReducer(initialState, {
      type: TYPES.GET_AUDIT_LOGS_SUCCESS,
      payload: {
        logs: mockLogs,
        page: 1,
        limit: 25,
        total: 2,
        pages: 1,
      },
    });

    expect(result.loading).toBe(false);
    expect(result.logs).toEqual(mockLogs);
    expect(result.total).toBe(2);
  });

  it("should handle GET_AUDIT_LOGS_FAILURE", () => {
    const error = "Failed to fetch logs";
    const result = auditLogReducer(initialState, {
      type: TYPES.GET_AUDIT_LOGS_FAILURE,
      payload: error,
    });

    expect(result.loading).toBe(false);
    expect(result.error).toBe(error);
  });

  it("should handle GET_AUDIT_LOG_STATS_REQUEST", () => {
    const result = auditLogReducer(initialState, {
      type: TYPES.GET_AUDIT_LOG_STATS_REQUEST,
    });

    expect(result.statsLoading).toBe(true);
  });

  it("should handle GET_AUDIT_LOG_STATS_SUCCESS", () => {
    const mockStats = {
      total: 100,
      byCategory: { AUTH: 50, USER: 50 },
      byAction: { LOGIN: 30, LOGOUT: 20 },
      byStatus: { success: 80, failure: 20 },
      recentActivity: {},
      topUsers: {},
    };

    const result = auditLogReducer(initialState, {
      type: TYPES.GET_AUDIT_LOG_STATS_SUCCESS,
      payload: { stats: mockStats },
    });

    expect(result.statsLoading).toBe(false);
    expect(result.stats).toEqual(mockStats);
  });

  it("should handle GET_AUDIT_LOG_STATS_FAILURE", () => {
    const result = auditLogReducer(initialState, {
      type: TYPES.GET_AUDIT_LOG_STATS_FAILURE,
    });

    expect(result.statsLoading).toBe(false);
  });

  it("should handle EXPORT_AUDIT_LOGS_REQUEST", () => {
    const result = auditLogReducer(initialState, {
      type: TYPES.EXPORT_AUDIT_LOGS_REQUEST,
    });

    expect(result.exporting).toBe(true);
  });

  it("should handle EXPORT_AUDIT_LOGS_SUCCESS", () => {
    const exportingState = { ...initialState, exporting: true };
    const result = auditLogReducer(exportingState, {
      type: TYPES.EXPORT_AUDIT_LOGS_SUCCESS,
    });

    expect(result.exporting).toBe(false);
  });

  it("should handle EXPORT_AUDIT_LOGS_FAILURE", () => {
    const exportingState = { ...initialState, exporting: true };
    const result = auditLogReducer(exportingState, {
      type: TYPES.EXPORT_AUDIT_LOGS_FAILURE,
    });

    expect(result.exporting).toBe(false);
  });

  it("should handle CLEAR_AUDIT_LOGS_REQUEST", () => {
    const result = auditLogReducer(initialState, {
      type: TYPES.CLEAR_AUDIT_LOGS_REQUEST,
    });

    expect(result.clearing).toBe(true);
  });

  it("should handle CLEAR_AUDIT_LOGS_SUCCESS", () => {
    const stateWithLogs = {
      ...initialState,
      logs: [{ _id: "1", action: "TEST" } as Partial<AuditLogEntry>],
      clearing: true,
    };

    const result = auditLogReducer(stateWithLogs, {
      type: TYPES.CLEAR_AUDIT_LOGS_SUCCESS,
    });

    expect(result.clearing).toBe(false);
    expect(result.logs).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("should handle CLEAR_AUDIT_LOGS_FAILURE", () => {
    const clearingState = { ...initialState, clearing: true };
    const result = auditLogReducer(clearingState, {
      type: TYPES.CLEAR_AUDIT_LOGS_FAILURE,
    });

    expect(result.clearing).toBe(false);
  });

  it("should handle SET_AUDIT_LOG_FILTERS", () => {
    const filters = { category: "AUTH", status: "success" };
    const result = auditLogReducer(initialState, {
      type: TYPES.SET_AUDIT_LOG_FILTERS,
      payload: filters,
    });

    expect(result.filters).toEqual(filters);
    expect(result.page).toBe(1);
  });

  it("should handle SET_AUDIT_LOG_PAGE", () => {
    const result = auditLogReducer(initialState, {
      type: TYPES.SET_AUDIT_LOG_PAGE,
      payload: 3,
    });

    expect(result.page).toBe(3);
  });
});
