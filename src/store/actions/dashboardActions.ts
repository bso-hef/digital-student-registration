import dashboardService from "@/lib/services/dashboardService";
import { DashboardLayout } from "@/types/dashboard";
import { toAppError } from "@/utils/general.utils";
import { errorNotification } from "@/utils/notification.utils";
import i18n from "i18next";

import { AppThunk } from "../store";
import * as TYPES from "../types";

const LAYOUT_STORAGE_KEY = "dashboard_layout";

export const getDashboardStats = (): AppThunk => async (dispatch) => {
  dispatch({ type: TYPES.GET_DASHBOARD_STATS_REQUEST });
  try {
    const { data } = await dashboardService.getStats();
    dispatch({ type: TYPES.GET_DASHBOARD_STATS_SUCCESS, payload: data });
  } catch (error) {
    errorNotification(i18n.t("actions.dashboardStatsFetchFailed"));
    const appError = await toAppError(error);
    dispatch({
      type: TYPES.GET_DASHBOARD_STATS_FAILURE,
      payload: appError.message,
    });
  }
};

export const getDashboardHealth =
  (silent = false): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.GET_DASHBOARD_HEALTH_REQUEST });
    try {
      const { data } = await dashboardService.getHealthFull();
      dispatch({ type: TYPES.GET_DASHBOARD_HEALTH_SUCCESS, payload: data });
    } catch (error) {
      if (!silent) {
        errorNotification(i18n.t("actions.dashboardHealthFetchFailed"));
      }
      const appError = await toAppError(error);
      dispatch({
        type: TYPES.GET_DASHBOARD_HEALTH_FAILURE,
        payload: appError.message,
      });
    }
  };

export const getDashboardActivity =
  (silent = false): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.GET_DASHBOARD_ACTIVITY_REQUEST });
    try {
      const { data } = await dashboardService.getRecentActivity();
      dispatch({
        type: TYPES.GET_DASHBOARD_ACTIVITY_SUCCESS,
        payload: data.activities,
      });
    } catch (error) {
      if (!silent) {
        // Silent fail - activity is supplementary data
        console.error("Failed to fetch activity:", error);
      }
      dispatch({ type: TYPES.GET_DASHBOARD_ACTIVITY_FAILURE });
    }
  };

export const refreshDashboard = (): AppThunk => async (dispatch) => {
  await Promise.all([
    dispatch(getDashboardStats()),
    dispatch(getDashboardActivity(true)),
  ]);
};

export const setDashboardLayout =
  (layout: DashboardLayout): AppThunk =>
  (dispatch) => {
    dispatch({ type: TYPES.SET_DASHBOARD_LAYOUT, payload: layout });
    saveDashboardLayoutToStorage(layout);
  };

export const resetDashboardLayout = (): AppThunk => (dispatch) => {
  dispatch({ type: TYPES.RESET_DASHBOARD_LAYOUT });
  localStorage.removeItem(LAYOUT_STORAGE_KEY);
};

export const toggleDashboardLock =
  (): AppThunk => (dispatch, getState) => {
    dispatch({ type: TYPES.TOGGLE_DASHBOARD_LOCK });
    const { dashboard } = getState();
    saveDashboardLayoutToStorage(dashboard.layout);
  };

export const loadDashboardLayout = (): AppThunk => (dispatch) => {
  const savedLayout = loadDashboardLayoutFromStorage();
  if (savedLayout) {
    dispatch({ type: TYPES.SET_DASHBOARD_LAYOUT, payload: savedLayout });
  }
};

const saveDashboardLayoutToStorage = (layout: DashboardLayout): void => {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  } catch (error) {
    console.error("Failed to save dashboard layout:", error);
  }
};

const loadDashboardLayoutFromStorage = (): DashboardLayout | null => {
  try {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (saved) {
      const layout = JSON.parse(saved) as DashboardLayout;

      // Migrate: Remove systemHealth if present, add recentActivity if missing
      let needsSave = false;
      if (layout.charts.includes("systemHealth")) {
        layout.charts = layout.charts.filter((c) => c !== "systemHealth");
        needsSave = true;
      }
      if (!layout.charts.includes("recentActivity")) {
        layout.charts.push("recentActivity");
        needsSave = true;
      }

      // Migrate: Add onboardingProgress if missing
      if (!layout.quickStats.includes("onboardingProgress")) {
        layout.quickStats.push("onboardingProgress");
        needsSave = true;
      }

      // Migrate: Remove activeClasses if present
      if (layout.quickStats.includes("activeClasses")) {
        layout.quickStats = layout.quickStats.filter(
          (s) => s !== "activeClasses",
        );
        needsSave = true;
      }

      // Migrate: Add isLocked if missing (default: true)
      if (layout.isLocked === undefined) {
        layout.isLocked = true;
        needsSave = true;
      }

      // Save migrated layout
      if (needsSave) {
        saveDashboardLayoutToStorage(layout);
      }

      return layout;
    }
  } catch (error) {
    console.error("Failed to load dashboard layout:", error);
  }
  return null;
};
