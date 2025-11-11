import auditLogService, {
  AuditLogFilters,
} from "@/lib/services/auditLogService";
import { toAppError } from "@/utils/general.utils";
import {
  errorNotification,
  successNotification,
} from "@/utils/notification.utils";
import dayjs from "dayjs";
import i18n from "i18next";

import { AppThunk } from "../store";
import * as TYPES from "../types";

export const getAuditLogs =
  (filters?: AuditLogFilters): AppThunk =>
  async (dispatch, getState) => {
    dispatch({ type: TYPES.GET_AUDIT_LOGS_REQUEST });
    try {
      const { page, limit } = getState().auditLog;
      const { data } = await auditLogService.getAll({
        ...filters,
        page,
        limit,
      });

      dispatch({ type: TYPES.GET_AUDIT_LOGS_SUCCESS, payload: data });
    } catch (error) {
      errorNotification(i18n.t("actions.auditLogFetchFailed"));
      const appError = await toAppError(error);
      dispatch({ type: TYPES.GET_AUDIT_LOGS_FAILURE, payload: appError });
    }
  };

export const getAuditLogStats = (): AppThunk => async (dispatch) => {
  dispatch({ type: TYPES.GET_AUDIT_LOG_STATS_REQUEST });
  try {
    const { data } = await auditLogService.getStats();

    dispatch({ type: TYPES.GET_AUDIT_LOG_STATS_SUCCESS, payload: data });
  } catch (error) {
    errorNotification(i18n.t("actions.auditLogStatsFailed"));
    const appError = await toAppError(error);
    dispatch({ type: TYPES.GET_AUDIT_LOG_STATS_FAILURE, payload: appError });
  }
};

export const exportAuditLogs =
  (format: "csv" | "json", filters?: AuditLogFilters): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.EXPORT_AUDIT_LOGS_REQUEST });
    try {
      const { data } = await auditLogService.export(format, filters);

      // Trigger download
      const blob = new Blob([data], {
        type: format === "csv" ? "text/csv" : "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${dayjs().format("YYYY-MM-DD-HHmmss")}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      dispatch({ type: TYPES.EXPORT_AUDIT_LOGS_SUCCESS });
      successNotification(i18n.t("actions.auditLogExportSuccess"));
    } catch (error) {
      errorNotification(i18n.t("actions.auditLogExportFailed"));
      const appError = await toAppError(error);
      dispatch({ type: TYPES.EXPORT_AUDIT_LOGS_FAILURE, payload: appError });
    }
  };

export const clearAuditLogs = (): AppThunk => async (dispatch) => {
  dispatch({ type: TYPES.CLEAR_AUDIT_LOGS_REQUEST });
  try {
    await auditLogService.clearLogs();

    dispatch({ type: TYPES.CLEAR_AUDIT_LOGS_SUCCESS });
    successNotification(i18n.t("actions.auditLogClearSuccess"));
    dispatch(getAuditLogs());
  } catch (error) {
    errorNotification(i18n.t("actions.auditLogClearFailed"));
    const appError = await toAppError(error);
    dispatch({ type: TYPES.CLEAR_AUDIT_LOGS_FAILURE, payload: appError });
  }
};

export const deleteSelectedAuditLogs =
  (ids: string[]): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.CLEAR_AUDIT_LOGS_REQUEST });
    try {
      await auditLogService.deleteSelected(ids);

      dispatch({ type: TYPES.CLEAR_AUDIT_LOGS_SUCCESS });
      successNotification(i18n.t("actions.auditLogClearSuccess"));
      dispatch(getAuditLogs());
    } catch (error) {
      errorNotification(i18n.t("actions.auditLogClearFailed"));
      const appError = await toAppError(error);
      dispatch({ type: TYPES.CLEAR_AUDIT_LOGS_FAILURE, payload: appError });
    }
  };

export const setAuditLogFilters =
  (filters: AuditLogFilters): AppThunk =>
  (dispatch) => {
    dispatch({ type: TYPES.SET_AUDIT_LOG_FILTERS, payload: filters });
    dispatch(getAuditLogs(filters));
  };

export const setAuditLogPage =
  (page: number): AppThunk =>
  (dispatch, getState) => {
    dispatch({ type: TYPES.SET_AUDIT_LOG_PAGE, payload: page });
    dispatch(getAuditLogs(getState().auditLog.filters));
  };
